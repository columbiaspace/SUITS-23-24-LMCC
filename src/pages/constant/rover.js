import React from 'react';
import RoverCam from "../../components/RoverCamera.js";

function rover() {
  return (
    <div className="column Rover">
          <div className="header-banner">
            <h2>Rover</h2>
          </div>
          <div
            className="gif-container"
            style={{ height: "50%", display: "flex", alignItems: "stretch" }}
          >
            <RoverCam />
          </div>
          <div
            className="gif-container"
            style={{ height: "50%", display: "flex", alignItems: "stretch" }}
          >
            <RoverCam />
          </div>
        </div>
  );
}

export default rover;