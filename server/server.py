from fastapi import FastAPI, HTTPException, Request
import httpx
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
import os
from server.mapping import *
from datetime import datetime
from server.initdb import *

app = FastAPI()

#Data
DATA_FILE = './server/json_databases/tss_data.json'

# GEOJson Files for mapping
BOUNDARY_LINES_FILE = './server/json_databases/geojson/boundary_lines.json'
DEFAULT_PINS_FILE = './server/json_databases/geojson/default_pins.json'
GEOLOGICAL_SITES_FILE = './server/json_databases/geojson/geological_sites.json'
USER_PINS_FILE = './server/json_databases/geojson/user_pins.json'
NAV_PATH = './server/json_databases/geojson/nav_path.json'

#Keys and IP Addresses
CONFIG_FILE = './server/json_databases/config_keys.json'

#Procedures
INGRESS_EGRESS_FILE = './server/json_databases/ingress_egress_procedures.json'
EQUIPMENT_REPAIR_FILE = './server/json_databases/equipment_repair.json'

#COMMS
ALERTS_FILE = './server/json_databases/alerts.json'
MESSAGES_FILE = './server/json_databases/messages.json'
GOLDEN_ER_FILE = './server/json_databases/golden_er_procedure.json'

# TSS Connection
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE, 'r') as f:
        config_data = json.load(f)
        tss_ip = config_data.get("TSS_IP", 'localhost:14141')
else:
    tss_ip = 'localhost:14141'

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get Json
async def fetch_json(url: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            # logger.error(f"Failed to fetch data from {url}, status code: {response.status_code}")
            return None
        return response.json()

@app.on_event("startup")
async def startup_event():
    initialize_database_files()

    task = asyncio.create_task(periodic_fetch_and_store())
    await asyncio.sleep(1)

async def periodic_fetch_and_store():
    eva_url = f"http://{tss_ip}/json_data/teams/0/EVA.json"
    telemetry_url = f"http://{tss_ip}/json_data/teams/0/TELEMETRY.json"
    while True:
        try:
            eva_data = await fetch_json(eva_url)
            telemetry_data = await fetch_json(telemetry_url)
            if eva_data and telemetry_data:
                combined_data = {
                    "timestamp": datetime.now().isoformat(),
                    "eva": eva_data,
                    "telemetry": telemetry_data
                }
                with open(DATA_FILE, 'w') as f:
                    json.dump(combined_data, f)
            else:
                pass
                # logger.warning("One or both data sets were not fetched successfully.")
        except Exception as e:
            pass
            # logger.error(f"An error occurred during periodic fetch: {e}")
        await asyncio.sleep(1)

# Save new IP or Key
@app.put("/update_config")
async def update_config(request: Request):
    new_config = await request.json()
    with open(CONFIG_FILE, 'r') as f:
        config_data = json.load(f)
    
    config_data.update(new_config)
    
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config_data, f)
    
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
async def check_connection(tss_ip: str = None, holo_ip: str = None, server_ip: str = None):
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
        elif holo_ip:
            try:
                response = await client.get(f"https://{holo_ip}/")
                if response.status_code == 200:
                    return {"status": "connected", "type": "HOLO_IP"}
                else:
                    return {"status": "no connection", "type": "HOLO_IP"}
            except Exception:
                return {"status": "no connection", "type": "HOLO_IP"}
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
            raise HTTPException(status_code=400, detail="Invalid request, provide either tss_ip, holo_ip, or server_ip")

class Marker(BaseModel):
    title: str
    description: str
    lat: float
    lng: float

@app.get("/get_geojson")
async def get_geojson():
    geojson_data = {"type": "FeatureCollection", "features": []}

    geojson_files = [BOUNDARY_LINES_FILE, DEFAULT_PINS_FILE, GEOLOGICAL_SITES_FILE, USER_PINS_FILE, NAV_PATH_FILE]

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
        raise HTTPException(status_code=500, detail="Failed to write to Goldern ER file.")
    
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
        
        # logger.error(str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except json.JSONDecodeError as e:
        # logger.error(f"JSON decode error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error decoding JSON data")
    except Exception as e:
        # logger.error(f"An unexpected error occurred: {str(e)}")
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
    print(f"Searching in file: {file_path} for point ID: {point_id}")
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            file_data = json.load(file)
            for feature in file_data.get("features", []):
                print(f"Checking feature: {feature}")
                if feature.get("id") == point_id:
                    if feature["geometry"]["type"] == "Point":
                        print(f"Found feature: {feature}")
                        return feature
                    else:
                        print(f"Feature found, but geometry is not 'Point': {feature['geometry']['type']}")
    return None

@app.post("/get_shortest_path")
async def get_shortest_path(point_request: PointIDRequest):
    geojson_files = [BOUNDARY_LINES_FILE, DEFAULT_PINS_FILE, GEOLOGICAL_SITES_FILE, USER_PINS_FILE]
    
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