import React from 'react';
import './../pages-style/rover.css';
import Map from '../components/Map.js'

function Rover() {
  return (
    <div className="rover-page">
      <div className="header-rover">
        <h1>Rover</h1>
        <p>This page will display the rover's collected samples, location, and camera data</p>
      </div>
      <div className="content-rover">
        <div className="column-rover">
          <p>Rover location and camera feed</p>
          <div className='gif-container-rover'>
            <Map/>
          </div>
        </div>
        <div className="column-rover">
          <p>Rover sample data</p>
        </div>
      </div>
    </div>
  );
}

export default Rover;
