from fastapi import FastAPI, HTTPException, Request
import httpx
from fastapi.middleware.cors import CORSMiddleware
import logging
import asyncio
import json
from datetime import datetime

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

tss_ip = 'localhost:14141'
DATA_FILE = 'tss_data.json'
CONFIG_FILE = 'config_keys.json'

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
            return None  # Return None for error handling
        return response.json()

@app.on_event("startup")
async def startup_event():
    """Create config_keys.json and start the periodic fetch task."""
    # Create config_keys.json
    config_data = {
        "TSS_IP": "localhost:14141",
        "MAPBOX_KEY": "your_mapbox_key_here",
        "HOLO_IP": "your_holo_ip_here"
    }
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config_data, f)

    # Start the periodic fetch task
    task = asyncio.create_task(periodic_fetch_and_store())
    await asyncio.sleep(1)  # Prevents the startup event from blocking indefinitely

@app.put("/update_config")
async def update_config(request: Request):
    """Endpoint to update the config_keys.json file."""
    new_config = await request.json()
    with open(CONFIG_FILE, 'w') as f:
        json.dump(new_config, f)
    return {"message": "Config updated successfully"}

async def periodic_fetch_and_store():
    """Fetch specific JSON data every second and store it."""
    eva_url = f"http://{tss_ip}/json_data/teams/0/EVA.json"
    telemetry_url = f"http://{tss_ip}/json_data/teams/0/TELEMETRY.json"
    while True:
        eva_data = await fetch_json(eva_url)
        telemetry_data = await fetch_json(telemetry_url)
        if eva_data and telemetry_data:  # Ensure both data sets are fetched successfully
            combined_data = {
                "timestamp": datetime.now().isoformat(),
                "eva": eva_data,
                "telemetry": telemetry_data
            }
            with open(DATA_FILE, 'w') as f:
                json.dump(combined_data, f)
        await asyncio.sleep(1)  # Sleep for a second before the next fetch

@app.get("/data")
async def read_data():
    """Endpoint to retrieve the periodically fetched and stored data."""
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

# Existing endpoints
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
