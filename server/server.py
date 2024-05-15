from fastapi import FastAPI, HTTPException, Request
import httpx
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import asyncio
import json
import os
from datetime import datetime

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

DATA_FILE = './server/json_databases/tss_data.json'
GEOJSON_FILE = './server/json_databases/created_pins.json'
BOUNDARY_LINES_FILE = './server/json_databases/boundary_lines.json'
CONFIG_FILE = './server/json_databases/config_keys.json'

# Load config to get TSS_IP
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

async def fetch_json(url: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            logger.error(f"Failed to fetch data from {url}, status code: {response.status_code}")
            return None
        return response.json()
@app.on_event("startup")
async def startup_event():
    default_config_data = {
        "TSS_IP": "localhost:14141",
        "MAPBOX_KEY": "your_mapbox_key_here",
        "HOLO_IP": "your_holo_ip_here",
        "SERVER_IP": "localhost:8000"
    }

    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            config_data = json.load(f)
    else:
        config_data = {}

    updated = False
    for key, value in default_config_data.items():
        if key not in config_data:
            config_data[key] = value
            updated = True

    if updated:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config_data, f)

    # Clear the GeoJSON file on startup
    with open(GEOJSON_FILE, 'w') as f:
        json.dump({"type": "FeatureCollection", "features": []}, f)

    task = asyncio.create_task(periodic_fetch_and_store())
    await asyncio.sleep(1)

@app.put("/update_config")
async def update_config(request: Request):
    new_config = await request.json()
    with open(CONFIG_FILE, 'r') as f:
        config_data = json.load(f)
    
    config_data.update(new_config)
    
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config_data, f)
    
    return {"message": "Config updated successfully"}

@app.get("/config")
async def get_config():
    with open(CONFIG_FILE, 'r') as f:
        config_data = json.load(f)
    return config_data

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
                logger.info("Data fetched and stored successfully.")
            else:
                logger.warning("One or both data sets were not fetched successfully.")
        except Exception as e:
            logger.error(f"An error occurred during periodic fetch: {e}")
        await asyncio.sleep(1)

@app.get("/data")
async def read_data():
    try:
        with open(DATA_FILE, 'r') as f:
            stored_data = json.load(f)
        return stored_data
    except FileNotFoundError:
        return {"error": "Data file not found. Please check back later."}

@app.get("/get_mapbox_key")
async def get_mapbox_key():
    with open(CONFIG_FILE, 'r') as f:
        config = json.load(f)
    return {"MAPBOX_KEY": config["MAPBOX_KEY"]}

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

@app.get("/geojson")
async def get_geojson():
    geojson_data = {"type": "FeatureCollection", "features": []}

    # Read boundary lines data
    if os.path.exists(BOUNDARY_LINES_FILE):
        with open(BOUNDARY_LINES_FILE, "r") as file:
            boundary_lines_data = json.load(file)
            if "features" in boundary_lines_data:
                geojson_data["features"].extend(boundary_lines_data["features"])

    # Read existing geojson data
    if os.path.exists(GEOJSON_FILE):
        with open(GEOJSON_FILE, "r") as file:
            existing_geojson_data = json.load(file)
            if "features" in existing_geojson_data:
                geojson_data["features"].extend(existing_geojson_data["features"])

    return geojson_data

@app.post("/add_marker")
async def add_marker(marker: Marker):
    if not os.path.exists(GEOJSON_FILE):
        data = {"type": "FeatureCollection", "features": []}
    else:
        with open(GEOJSON_FILE, "r") as file:
            data = json.load(file)
    
    new_feature = {
        "type": "Feature",
        "properties": {
            "title": marker.title,
            "description": marker.description,
            "marker-color": "#FF0000",
        },
        "geometry": {
            "type": "Point",
            "coordinates": [marker.lng, marker.lat]
        },
        "id": len(data["features"])
    }
    
    data["features"].append(new_feature)
    
    with open(GEOJSON_FILE, "w") as file:
        json.dump(data, file)
    
    return {"message": "Marker added successfully"}

@app.get("/json_data/{filename}")
async def get_general_json(filename: str):
    url = f"http://{tss_ip}/json_data/{filename}"
    return await fetch_json(url)

@app.get("/json_data/rocks/RockData.json")
async def get_rock_data():
    url = f"http://{tss_ip}/json_data/rocks/RockData.json"
    return await fetch_json(url)

@app.get("/json_data/teams/{team_number}/{filename}")
async def get_team_data(team_number: int, filename: str):
    if not (0 <= team_number <= 10):
        raise HTTPException(status_code=400, detail="Team number must be between 0 and 10")
    url = f"http://{tss_ip}/json_data/teams/{team_number}/{filename}"
    return await fetch_json(url)
