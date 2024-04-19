from fastapi import FastAPI, HTTPException
import httpx

app = FastAPI()

@app.get("/fetch/{subsystem}")
async def fetch_data(subsystem: str):
    url = f"http://localhost:14141/json_data/teams/0/{subsystem}.json"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()  # Raises exception for 4XX/5XX responses
            return response.json()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=400, detail=f"Request to {url} failed.") from exc
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error response from {url}.") from exc
