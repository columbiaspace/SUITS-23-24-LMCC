from fastapi import FastAPI, HTTPException, Request
import httpx
from fastapi.middleware.cors import CORSMiddleware
import logging
import asyncio
import json
import os
from datetime import datetime

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

DATA_FILE = 'tss_data.json'
CONFIG_FILE = 'config_keys.json'

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
            return None  # Return None for error handling
        return response.json()

@app.on_event("startup")
async def startup_event():
    """Create config_keys.json and start the periodic fetch task."""
    # Default config values
    default_config_data = {
        "TSS_IP": "localhost:14141",
        "MAPBOX_KEY": "your_mapbox_key_here",
        "HOLO_IP": "your_holo_ip_here"
    }

    # Load existing config if it exists, otherwise use the default
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            config_data = json.load(f)
    else:
        config_data = {}

    # Update config with default values if keys are missing
    updated = False
    for key, value in default_config_data.items():
        if key not in config_data:
            config_data[key] = value
            updated = True

    # Save the updated config if there were any changes
    if updated:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config_data, f)

    # Start the periodic fetch task
    task = asyncio.create_task(periodic_fetch_and_store())
    await asyncio.sleep(1)  # Prevents the startup event from blocking indefinitely

@app.put("/update_config")
async def update_config(request: Request):
    """Endpoint to update the config_keys.json file."""
    new_config = await request.json()
    with open(CONFIG_FILE, 'r') as f:
        config_data = json.load(f)
    
    config_data.update(new_config)
    
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config_data, f)
    
    return {"message": "Config updated successfully"}

async def periodic_fetch_and_store():
    """Fetch specific JSON data every second and store it."""
    eva_url = f"http://{tss_ip}/json_data/teams/0/EVA.json"
    telemetry_url = f"http://{tss_ip}/json_data/teams/0/TELEMETRY.json"
    while True:
        try:
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
                logger.info("Data fetched and stored successfully.")
            else:
                logger.warning("One or both data sets were not fetched successfully.")
        except Exception as e:
            logger.error(f"An error occurred during periodic fetch: {e}")
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
