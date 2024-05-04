from fastapi import FastAPI, HTTPException
import httpx
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

tss_ip = '10.207.105.35:14141'
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
            return {"error": f"Failed to fetch data, status code: {response.status_code}"}
        return response.json()

# Endpoint to handle general JSON files like COMM.json, DCU.json, etc.
@app.get("/json_data/{filename}")
async def get_general_json(filename: str):
    url = f"http://{tss_ip}/json_data/{filename}"
    return await fetch_json(url)

# Endpoint for the rocks data
@app.get("/json_data/rocks/RockData.json")
async def get_rock_data():
    url = "http://{tss_ip}/json_data/rocks/RockData.json"
    return await fetch_json(url)

# Endpoint for team-specific JSON data under teams/{team_number}
@app.get("/json_data/teams/{team_number}/{filename}")
async def get_team_data(team_number: int, filename: str):
    if not (0 <= team_number <= 10):
        return {"error": "Team number must be between 0 and 10"}
    url = f"http://{tss_ip}/json_data/teams/{team_number}/{filename}"
    return await fetch_json(url)

