import json
import random
import os
from datetime import datetime
import asyncio
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel
import requests
import utm
from geojson import Feature, FeatureCollection, dump
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from server.mapping import *
from server.initdb import *

app = FastAPI()

# Data
DATA_FILE = './server/json_databases/tss_data.json'
ROCK_LUT = './server/json_databases/ROCK_DATA_FINAL.json'
DCU_UIA_FILE = './server/json_databases/DCUUIA.json'
# GEOJson Files for mapping
BOUNDARY_LINES_FILE = './server/json_databases/geojson/boundary_lines.json'
DEFAULT_PINS_FILE = './server/json_databases/geojson/default_pins.json'
GEOLOGICAL_SITES_FILE = './server/json_databases/geojson/geological_sites.json'
USER_PINS_FILE = './server/json_databases/geojson/user_pins.json'
NAV_PATH = './server/json_databases/geojson/nav_path.json'
CURRENT_LOCATIONS_FILE = './server/json_databases/geojson/CURRENT_LOCATION.json'

# Keys and IP Addresses
CONFIG_FILE = './server/json_databases/config_keys.json'

# Procedures
INGRESS_EGRESS_FILE = './server/json_databases/ingress_egress_procedures.json'
EQUIPMENT_REPAIR_FILE = './server/json_databases/equipment_repair.json'

# COMMS
ALERTS_FILE = './server/json_databases/alerts.json'
MESSAGES_FILE = './server/json_databases/messages.json'
GOLDEN_ER_FILE = './server/json_databases/golden_er_procedure.json'
SAVED_ROCKS_FILE = './server/json_databases/saved_rocks.json'

# Initialize variables for configuration data
tss_ip = 'localhost:14141'
team_number = None

# Load configuration from file
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE, 'r') as f:
        config_data = json.load(f)
        tss_ip = config_data.get("TSS_IP", tss_ip)
        team_number = config_data.get("EV1_TEAM_ID")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
async def fetch_json(url: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            return None
        return response.json()

def initialize_files():
    # Create DATA_FILE if it does not exist
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump({}, f)
    # Create DCU_UIA_FILE if it does not exist
    if not os.path.exists(DCU_UIA_FILE):
        with open(DCU_UIA_FILE, 'w') as f:
            json.dump({}, f)


@app.on_event("startup")
async def startup_event():
    initialize_files()  # Ensure files are created if they do not exist
    initialize_database_files()
    task = asyncio.create_task(periodic_fetch_and_store())
    await asyncio.sleep(1)

async def periodic_fetch_and_store():
    global team_number
    team_number = config_data.get("EV1_TEAM_ID")
    while team_number is None:
        await asyncio.sleep(1)

    eva_url = f"http://{tss_ip}/json_data/teams/{team_number}/EVA.json"
    telemetry_url = f"http://{tss_ip}/json_data/teams/{team_number}/TELEMETRY.json"
    dcu_url = f"http://{tss_ip}/json_data/DCU.json"
    uia_url = f"http://{tss_ip}/json_data/UIA.json"
    warnings_url = f'http://{tss_ip}/json_data/ERROR.json'
    spec_url = f'http://{tss_ip}/json_data/SPEC.json'

    while True:
        print('running')
        try:
            # Fetch EVA and telemetry data
            eva_data = await fetch_json(eva_url)
            telemetry_data = await fetch_json(telemetry_url)
            warnings_data = await fetch_json(warnings_url)
            spec_data = await fetch_json(spec_url)
            
            if eva_data and telemetry_data and warnings_data:
                combined_data = {
                    "timestamp": datetime.now().isoformat(),
                    "eva": eva_data,
                    "telemetry": telemetry_data,
                    "warnings": warnings_data,
                    "spec": spec_data
                }
                with open(DATA_FILE, 'w') as f:
                    json.dump(combined_data, f)

            # Fetch DCU and UIA data
            dcu_data = await fetch_json(dcu_url)
            uia_data = await fetch_json(uia_url)
            if dcu_data and uia_data:
                combined_dcu_uia_data = {
                    "timestamp": datetime.now().isoformat(),
                    "dcu": dcu_data["dcu"],
                    "uia": uia_data["uia"]
                }
                with open(DCU_UIA_FILE, 'w') as f:
                    json.dump(combined_dcu_uia_data, f)

        except Exception as e:
            print(f"Error fetching or saving data: {e}")

        await asyncio.sleep(1)  # Adjust the sleep interval as needed

@app.get("/dcu_uia")
async def get_dcu_uia():
    if os.path.exists(DCU_UIA_FILE):
        with open(DCU_UIA_FILE, 'r') as f:
            data = json.load(f)
        return data
    else:
        raise HTTPException(status_code=404, detail="DCUUIA.json not found")
    
@app.get("/warnings")
async def get_warnings():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        return data['warnings']
    else:
        raise HTTPException(status_code=404, detail="DATA.json not found")
    
@app.get("/spec_scans")
async def get_spec_scans():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        return data['spec']
    else:
        raise HTTPException(status_code=404, detail="DATA.json not found")
    
def utm_to_latlon(easting, northing, zone_number=15, zone_letter='R'):
    return utm.to_latlon(easting, northing, zone_number, zone_letter)

@app.get('/update_positions')
def fetch_and_update_positions():
    try:
        # URLs for the rover and IMU data
        rover_url = f"http://{tss_ip}/json_data/ROVER.json"
        imu_url = f"http://{tss_ip}/json_data/IMU.json"

        # Fetching data
        rover_response = requests.get(rover_url)
        rover_response.raise_for_status()  # Ensure we raise an error for bad status codes
        rover_data = rover_response.json()
        
        imu_response = requests.get(imu_url)
        imu_response.raise_for_status()  # Ensure we raise an error for bad status codes
        imu_data = imu_response.json()

        # Getting positions for rover, eva1, and eva2
        positions = {
            "rover": rover_data["rover"],
            "eva1": imu_data["imu"]["eva1"],
            "eva2": imu_data["imu"]["eva2"]
        }

        features = []

        for idx, (name, pos) in enumerate(positions.items()):
            posx, posy = pos["posx"], pos["posy"]

            # Assuming a default UTM zone for this example
            zone_number = 15
            zone_letter = 'R'
            lat, lon = utm_to_latlon(posx, posy, zone_number, zone_letter)

            feature = {
                "type": "Feature",
                "properties": {
                    "Name": name.capitalize()
                },
                "geometry": {
                    "coordinates": [lon, lat],
                    "type": "Point"
                },
                "id": 100 + idx
            }
            features.append(feature)

        feature_collection = FeatureCollection(features)

        with open(CURRENT_LOCATIONS_FILE, "w") as f:
            dump(feature_collection, f)

        return (f"Updated CURRENT_LOCATIONS.geojson with new positions for rover, eva1, and eva2")

    except Exception as e:
        return (f"Error fetching or updating positions: {e}")
        
# Save new IP or Key
@app.put("/update_config")
async def update_config(request: Request):
    new_config = await request.json()
    global tss_ip, team_number
    with open(CONFIG_FILE, 'r') as f:
        config_data = json.load(f)
    
    config_data.update(new_config)
    
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config_data, f)
    
    tss_ip = config_data.get("TSS_IP", tss_ip)
    team_number = config_data.get("TEAM_NUMBER", team_number)

    return {"message": "Config updated successfully"}

# Return keys and IPs
@app.get("/get_config")
async def get_config():
    with open(CONFIG_FILE, 'r') as f:
        config_data = json.load(f)
    return config_data

# Get Telemetry data
@app.get("/get_telemetry_data")
async def read_data():
    try:
        with open(DATA_FILE, 'r') as f:
            stored_data = json.load(f)
        return stored_data
    except FileNotFoundError:
        return {"error": "Data file not found. Please check back later."}

# Check Hololens, Server, and TSS Connection
@app.get("/check_connection")
async def check_connection(tss_ip: str = None, server_ip: str = None):
    async with httpx.AsyncClient() as client:
        if tss_ip:
            try:
                response = await client.get(f"http://{tss_ip}/")
                if response.status_code == 200:
                    return {"status": "connected", "type": "TSS_IP"}
                else:
                    return {"status": "no connection", "type": "TSS_IP"}
            except Exception:
                return {"status": "no connection", "type": "TSS_IP"}
        elif server_ip:
            try:
                response = await client.get(f"http://{server_ip}/docs")
                if response.status_code == 200:
                    return {"status": "connected", "type": "SERVER_IP"}
                else:
                    return {"status": "no connection", "type": "SERVER_IP"}
            except Exception:
                return {"status": "no connection", "type": "SERVER_IP"}
        else:
            raise HTTPException(status_code=400, detail="Invalid request, provide either tss_ip or server_ip")

class Marker(BaseModel):
    title: str
    description: str
    lat: float
    lng: float

@app.get("/get_geojson")
async def get_geojson():
    geojson_data = {"type": "FeatureCollection", "features": []}

    geojson_files = [BOUNDARY_LINES_FILE, DEFAULT_PINS_FILE, GEOLOGICAL_SITES_FILE, USER_PINS_FILE, NAV_PATH, CURRENT_LOCATIONS_FILE]

    for file_path in geojson_files:
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                file_data = json.load(file)
                if "features" in file_data:
                    geojson_data["features"].extend(file_data["features"])

    return geojson_data

class GeoJSONFeature(BaseModel):
    type: str
    properties: dict
    geometry: dict
    id: int

@app.post("/add_feature")
async def add_feature(feature: GeoJSONFeature):
    if not os.path.exists(USER_PINS_FILE):
        data = {"type": "FeatureCollection", "features": []}
    else:
        with open(USER_PINS_FILE, "r") as file:
            data = json.load(file)
    
    # Check if an object with the same ID already exists
    existing_feature_index = next((index for (index, d) in enumerate(data["features"]) if d["id"] == feature.id), None)
    
    if existing_feature_index is not None:
        # Update the existing feature
        data["features"][existing_feature_index] = feature.dict()
    else:
        # Append the new feature
        data["features"].append(feature.dict())
    
    with open(USER_PINS_FILE, "w") as file:
        json.dump(data, file)
    
    return {"message": "Feature added/updated successfully"}

# Get sent ER Procedure (Used by HMD)
@app.get("/get_sent_procedure")
async def get_procedure():
    try:
        if os.path.exists(GOLDEN_ER_FILE):
            with open(GOLDEN_ER_FILE, 'r') as file:
                data = json.load(file)
        else:
            raise FileNotFoundError(f"{GOLDEN_ER_FILE} not found")
        return data
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/send_procedure")
async def get_procedure(id: int):
    try:
        with open(EQUIPMENT_REPAIR_FILE, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Equipment repair file not found.")
    
    # Find the procedure by ID
    procedure = next((proc for proc in data["procedures"] if proc["id"] == id), None)
    
    if not procedure:
        raise HTTPException(status_code=404, detail="Procedure not found.")
    
    # Write the procedure to the new JSON file
    try:
        with open(GOLDEN_ER_FILE, 'w') as file:
            json.dump(procedure, file, indent=4)
    except IOError:
        raise HTTPException(status_code=500, detail="Failed to write to Golden ER file.")
    
    return {"message": "Procedure exported successfully.", "procedure": procedure}

with open(INGRESS_EGRESS_FILE, 'r') as f:
    procedures = json.load(f)

@app.get("/procedures")
def get_procedures():
    return procedures

# Get Equipment Procedures
@app.get("/get_equipment_procedures")
async def get_equipment_procedures():
    try:
        if os.path.exists(EQUIPMENT_REPAIR_FILE):
            with open(EQUIPMENT_REPAIR_FILE, 'r') as file:
                data = json.load(file)
        else:
            raise FileNotFoundError(f"{EQUIPMENT_REPAIR_FILE} not found")
        procedures = data.get("procedures", [])
        return procedures
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail="Error decoding JSON data")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

class Step(BaseModel):
    step: str
    role: str
    description: str

class Procedure(BaseModel):
    id: int
    title: str
    steps: list[Step]

@app.post("/add_procedure", response_model=Procedure)
async def add_procedure(procedure: Procedure):
    if os.path.exists(EQUIPMENT_REPAIR_FILE):
        with open(EQUIPMENT_REPAIR_FILE, 'r') as file:
            data = json.load(file)
    else:
        data = {"procedures": []}

    if any(existing_procedure["id"] == procedure.id for existing_procedure in data["procedures"]):
        raise HTTPException(status_code=400, detail="Procedure with this ID already exists")

    data["procedures"].append(procedure.dict())

    with open(EQUIPMENT_REPAIR_FILE, 'w') as file:
        json.dump(data, file, indent=4)

    return procedure

@app.delete("/delete_procedure/{id}", response_model=dict)
async def delete_procedure(id: int):
    if os.path.exists(EQUIPMENT_REPAIR_FILE):
        with open(EQUIPMENT_REPAIR_FILE, 'r') as file:
            data = json.load(file)
    else:
        raise HTTPException(status_code=404, detail=f"{EQUIPMENT_REPAIR_FILE} not found")

    procedures = data.get("procedures", [])
    updated_procedures = [procedure for procedure in procedures if procedure["id"] != id]

    if len(procedures) == len(updated_procedures):
        raise HTTPException(status_code=404, detail="Procedure not found")

    data["procedures"] = updated_procedures

    with open(EQUIPMENT_REPAIR_FILE, 'w') as file:
        json.dump(data, file, indent=4)

    return {"message": "Procedure deleted successfully"}

@app.put("/update_procedure/{id}", response_model=Procedure)
async def update_procedure(id: int, updated_procedure: Procedure):
    if os.path.exists(EQUIPMENT_REPAIR_FILE):
        with open(EQUIPMENT_REPAIR_FILE, 'r') as file:
            data = json.load(file)
    else:
        raise HTTPException(status_code=404, detail=f"{EQUIPMENT_REPAIR_FILE} not found")

    procedures = data.get("procedures", [])
    for index, procedure in enumerate(procedures):
        if procedure["id"] == id:
            procedures[index] = updated_procedure.dict()
            break
    else:
        raise HTTPException(status_code=404, detail="Procedure not found")

    data["procedures"] = procedures

    with open(EQUIPMENT_REPAIR_FILE, 'w') as file:
        json.dump(data, file, indent=4)

    return updated_procedure

class PointIDRequest(BaseModel):
    start_id: int
    end_id: int

def find_point_by_id(file_path, point_id):
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            file_data = json.load(file)
            for feature in file_data.get("features", []):
                if feature.get("id") == point_id:
                    if feature["geometry"]["type"] == "Point":
                        return feature
    return None

@app.post("/get_shortest_path")
async def get_shortest_path(point_request: PointIDRequest):
    geojson_files = [BOUNDARY_LINES_FILE, DEFAULT_PINS_FILE, GEOLOGICAL_SITES_FILE, USER_PINS_FILE, CURRENT_LOCATIONS_FILE]
    
    start_feature = None
    end_feature = None

    for file_path in geojson_files:
        if not start_feature:
            start_feature = find_point_by_id(file_path, point_request.start_id)
        if not end_feature:
            end_feature = find_point_by_id(file_path, point_request.end_id)
        if start_feature and end_feature:
            break

    if not start_feature or not end_feature:
        raise HTTPException(status_code=404, detail="One or both points not found")

    try:
        start_coords = start_feature["geometry"]["coordinates"]
        end_coords = end_feature["geometry"]["coordinates"]
        
        if len(start_coords) < 2 or len(end_coords) < 2:
            raise HTTPException(status_code=400, detail="Invalid coordinates in features")

        geojson_result = get_shortest_path_geojson(start_coords[1], start_coords[0], end_coords[1], end_coords[0])
        
        # Overwrite the contents of NAV_PATH with the geojson result
        with open(NAV_PATH, 'w') as nav_file:
            nav_file.write(geojson_result)
        
        return json.loads(geojson_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define RockData model for response
class RockData(BaseModel):
    name: str
    id: int
    data: dict

@app.get("/get_rover_spec_scan", response_model=RockData)
async def get_rover_spec_scan():
    print(tss_ip)
    rover_url = f"http://{tss_ip}/json_data/ROVER.json"
    rover_data = await fetch_json(rover_url)
    if rover_data is None:
        raise HTTPException(status_code=500, detail="Error fetching rover data")

    qr_id = rover_data['rover']['qr_id']

    # Fetch rock data from the ROCK_LUT
    try:
        with open(ROCK_LUT, 'r') as file:
            rock_data = json.load(file)
        rock = next((rock for rock in rock_data['ROCKS'] if rock['id'] == qr_id), None)
        if rock is None:
            raise HTTPException(status_code=404, detail="Rock not found")
        return rock
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Rock LUT file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding Rock LUT file")

@app.post("/drop_pin_here/{eva_num}")
async def drop_pin_here(eva_num: int):
    if eva_num not in [1, 2]:
        raise HTTPException(status_code=400, detail="Invalid EVA number. Must be 1 or 2.")

    try:
        # Read current locations
        with open(CURRENT_LOCATIONS_FILE, 'r') as f:
            current_locations = json.load(f)
        
        # Find the corresponding EVA feature
        eva_name = f"Eva{eva_num}"
        eva_feature = next((feature for feature in current_locations["features"] if feature["properties"]["Name"] == eva_name), None)
        
        if not eva_feature:
            raise HTTPException(status_code=404, detail=f"{eva_name} not found in current locations.")

        # Generate EVA Time as minutes and seconds concatenated as an integer
        now = datetime.now()
        eva_time = int(now.strftime("%M%S"))

        # Create a new feature
        new_feature = {
            "type": "Feature",
            "properties": {
                "Name": f"{eva_name} @ {eva_time}"
            },
            "geometry": eva_feature["geometry"],
            "id": eva_time
        }

        # Read or initialize USER_PINS_FILE
        if os.path.exists(USER_PINS_FILE):
            with open(USER_PINS_FILE, 'r') as f:
                user_pins = json.load(f)
        else:
            user_pins = {"type": "FeatureCollection", "features": []}

        # Append the new feature
        user_pins["features"].append(new_feature)

        # Write back to USER_PINS_FILE
        with open(USER_PINS_FILE, 'w') as f:
            json.dump(user_pins, f, indent=4)

        return {"message": "Pin added successfully", "feature": new_feature}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save_spec")
async def save_spec():
    async with httpx.AsyncClient() as client:
        response = await client.get('http://localhost:8000/spec_scans')
        
        if response.status_code == 200:
            data = response.json()
            eva1_data = data['spec']['eva1']

            # Load existing data
            with open(SAVED_ROCKS_FILE, 'r') as file:
                saved_rocks_data = json.load(file)

            # Append new data to the "saved rocks" array
            saved_rocks_data["saved rocks"].append(eva1_data)

            # Save updated data
            with open(SAVED_ROCKS_FILE, 'w') as file:
                json.dump(saved_rocks_data, file, indent=4)

            return {"message": "Data saved successfully"}
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to retrieve data")


@app.get("/get_spec")
async def get_spec():
    try:
        if os.path.exists(SAVED_ROCKS_FILE):
            with open(SAVED_ROCKS_FILE, 'r') as file:
                data = json.load(file)
        else:
            raise FileNotFoundError(f"{SAVED_ROCKS_FILE} not found")
        return data
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)

