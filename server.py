from fastapi import FastAPI
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app = FastAPI()

# Define a helper function to fetch JSON from the server
async def fetch_json(url: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

# Endpoint to handle general JSON files like COMM.json, DCU.json, etc.
@app.get("/json_data/{filename}")
async def get_general_json(filename: str):
    url = f"http://localhost:14141/json_data/{filename}"
    return await fetch_json(url)

# Endpoint for the rocks data
@app.get("/json_data/rocks/RockData.json")
async def get_rock_data():
    url = "http://localhost:14141/json_data/rocks/RockData.json"
    return await fetch_json(url)

# Endpoint for team-specific JSON data under teams/{team_number}
@app.get("/json_data/teams/{team_number}/{filename}")
async def get_team_data(team_number: int, filename: str):
    if not (0 <= team_number <= 10):
        return {"error": "Team number must be between 0 and 10"}
    url = f"http://localhost:14141/json_data/teams/{team_number}/{filename}"
    return await fetch_json(url)

