# CUITS 2024 LMCC

CUITS 2024 LMCC is a React application designed to simulate a Mars mission control center, providing real-time data and control over various mission aspects.

## Features

- **Constant Monitoring:** Real-time display of astronaut biometrics, suit data, rover status, and mission progress.
- **Navigation:** Complex map display with checkpoint management and pathfinding.
- **Equipment Management:** Overview of available and in-use equipment.
- **Sample Management (Egress/Ingress):** Handling of collected samples and procedural checklists.
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
- **/Egress:** Management of collected samples.
- **/Nav:** Interactive navigation system.
- **/Equipment:** Equipment overview and status.
- **/Rocks:** Geological sampling data and analysis.
- **/Rover:** Rover telemetry and control.
- **/Ingress:** Procedures and checklists for sample handling.

## Contributing

Contributions to the CUITS 2024 LMCC project are welcome. Please follow the standard git workflow for contributions:

1. Clone the repository.
2. Create a new feature branch (`git checkout -b feature/your_feature`).
3. Make changes and commit (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your_feature`).
5. Create a new Pull Request.
