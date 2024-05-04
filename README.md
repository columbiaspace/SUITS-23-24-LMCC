# CUITS 2024 LMCC

CUITS 2024 LMCC is a React application designed to simulate a Mars mission control center, providing real-time data and control over various mission aspects.  

Check it out [here!](https://columbiaspace.github.io/SUITS-23-24-LMCC/)   
## Features

- **Constant Monitoring:** Real-time display of astronaut biometrics, suit data, rover status, and mission progress.
- **Navigation:** Complex map display with checkpoint management and pathfinding.
- **Equipment Repait and Diagnosis:** Procedures and checklists.
- **Egress/Ingress:** Procedural checklists.
- **Rover Control:** Real-time location and camera data display.
- **Geological Sampling:** Interactive geological map and rock data management.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd CUITS-2024-LMCC
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```
2. Open `http://localhost:3000` in a web browser.

## Pages

- **/Constant:** Constant monitoring of mission-critical data.
- **/Focus:** Landing page for mission focus.
- **/Setup:** Configuration of mission parameters and settings.
- **/Egress:** Procedures for exiting the habitat.
- **/Nav:** Interactive navigation system.
- **/Equipment:** Equipment diagnosis and repair procedures.
- **/Rocks:** Geological sampling data and analysis.
- **/Rover:** Rover telemetry and control.
- **/Ingress:** Procedures for re-entering the habitat.

## Contributing

Contributions to the CUITS 2024 LMCC project are welcome. Please follow the standard git workflow for contributions:

1. Clone the repository.
2. Create a new feature branch (`git checkout -b feature/your_feature`).
3. Make changes and commit (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your_feature`).
5. Create a new Pull Request.

# Backend API
```
# SUITS API Documentation

This API provides access to JSON data for various resources including rocks, teams, and telemetry details. The API is built with FastAPI and runs locally on `http://localhost:8000`.

## Prerequisites

Before you can run the API, ensure you have the following installed:
- Python 3.8+
- FastAPI
- Uvicorn
- httpx

You can install the necessary libraries with pip:

```bash
pip install fastapi uvicorn httpx
```

## Running the API

To start the API server, use the following command in the directory containing your FastAPI application:

```bash
uvicorn main:app --reload
```

This command will start the server on `http://127.0.0.1:8000` and will automatically reload the server upon any file changes.

## API Endpoints

Here are some of the available endpoints:

- `/json_data/{filename}`: General endpoint for fetching JSON data such as `COMM.json`, `DCU.json`, etc.
- `/json_data/rocks/RockData.json`: Fetches detailed rock data.
- `/json_data/teams/{team_number}/{filename}`: Fetches team-specific data.

## Requesting Data from Unity C#

To request data from the API in a Unity C# application, you can use the `UnityWebRequest` class. Here's an example of how to fetch data from the rocks endpoint:

```csharp
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class DataLoader : MonoBehaviour
{
    private void Start()
    {
        StartCoroutine(GetRockData());
    }

    IEnumerator GetRockData()
    {
        string uri = "http://localhost:8000/json_data/rocks/RockData.json";
        using (UnityWebRequest webRequest = UnityWebRequest.Get(uri))
        {
            // Request and wait for the desired page.
            yield return webRequest.SendWebRequest();

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("Error: " + webRequest.error);
            }
            else
            {
                Debug.Log("Received: " + webRequest.downloadHandler.text);
            }
        }
    }
}
```

## Requesting Data from ReactJS

For ReactJS applications, you can use the Fetch API to request data from the API. Here is an example of how to fetch team data in ReactJS:

```javascript
import React, { useEffect, useState } from 'react';

function TeamData() {
    const [teamData, setTeamData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:8000/json_data/teams/1/Completed_EVA.json');
            const data = await response.json();
            setTeamData(data);
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Team Data</h1>
            {teamData && <pre>{JSON.stringify(teamData, null, 2)}</pre>}
        </div>
    );
}

export default TeamData;
```

This script makes a GET request to the API and displays the JSON data on the page.

## Conclusion

This API provides a straightforward method for accessing JSON data for various use cases in development. By following the above instructions, you can integrate this API into Unity C# projects or ReactJS applications.
```

