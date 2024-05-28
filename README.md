# CUITS 2024 LMCC and API

CUITS 2024 LMCC is a React application designed to simulate a Mars mission control center, providing real-time data and control over various mission aspects.  

Check it out [here!](https://columbiaspace.github.io/SUITS-23-24-LMCC/)   
## Features

- **Constant Monitoring:** Real-time display of astronaut biometrics, suit data, rover status, and mission progress.
- **Navigation:** Complex map display with checkpoint management and pathfinding.
- **Equipment Repait and Diagnosis:** Procedures and checklists.
- **Egress/Ingress:** Procedural checklists.
- **Rover Control:** Real-time location and camera data display.
- **Geological Sampling:** Interactive geological map and rock data management.

# Project Setup

## Software Requirements

- Docker Desktop
- Python 3.12.3
- pip
- Node.js
- npm

## Steps

1. **Clone the Repository**

   ```sh
   git clone https://github.com/columbiaspace/SUITS-23-24-LMCC.git
   ```

2. **Install Python Requirements**

   Navigate to the cloned repository and install the Python dependencies listed in the `requirements.txt` file.

   ```sh
   pip install -r requirements.txt
   ```

3. **Setup the TSS Using Docker**

   Follow the instructions in the README at [TSS_2024 Docker Setup](https://github.com/dignojrteogalbo/TSS_2024/tree/docker) to set up the TSS.

4. **Acquire a Mapbox API Key**

   Get a Mapbox API key by following the instructions at [Mapbox Access Token Documentation](https://docs.mapbox.com/help/glossary/access-token/).

5. **Run the Project**

   - If on macOS, run:

     ```sh
     ./run_lmcc_mac.sh
     ```

   - If on Windows, run:

     ```sh
     ./run_lmcc_windows.sh
     ```

## Additional Notes

Make sure all software requirements are installed before proceeding with the steps. If you encounter any issues during the setup process, refer to the respective documentation for Docker, Python, pip, Node.js, and npm.

---

This project is part of the SUITS 2023-2024 program at Columbia Space Initiative.


