import React, { useEffect, useState } from 'react';
import Map from '../../components/Map.js';
import RoverCam from "../../components/RoverCamera.js";
import '../../pages-style/rover.css';

function Rover() {
  const [roverData, setRoverData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_rover_spec_scan');
        const data = await response.json();
        setRoverData(data);
      } catch (error) {
        console.error('Error fetching rover data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="page-container">
      <div className="header-rover">Rover Monitoring</div>
      <div className="content-rover">
        <div className="left-column-rover">
            <Map id="rovMap" zoom={19}/>
        </div>
        <div className="right-column-rover">
            <RoverCam />
          {roverData ? (
            <div className="table">
              <div className="table-row">
                <div className="table-header">Property</div>
                <div className="table-header">Value</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Name</div>
                <div className="table-cell">{roverData.name}</div>
              </div>
              <div className="table-row">
                <div className="table-cell">ID</div>
                <div className="table-cell">{roverData.id}</div>
              </div>
              {Object.entries(roverData.data).map(([key, value]) => (
                <div className="table-row" key={key}>
                  <div className="table-cell">{key}</div>
                  <div className="table-cell">{value}</div>
                </div>
              ))}
            </div>
          ) : (
            'Loading...'
          )}
        </div>
      </div>
    </div>
  );
}

export default Rover;
