import React from 'react';
import '../../pages-style/rover.css';
import '../../pages-style/page.css';
import Map from '../../components/Map.js';
import RoverCam from "../../components/RoverCamera.js";

function Rover() {
  return (
    <div className="pagecontainer">
      <div className="content-rover">
        <div className="left-column-rover">
          <div className="rover-cam">
            <RoverCam />
          </div>
          <div className="map"><Map /></div>
        </div>
        <div className="right-column-rover">Rover sample data</div>
      </div>
    </div>
  );
}

export default Rover;
