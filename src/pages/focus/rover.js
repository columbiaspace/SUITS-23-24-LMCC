import React, { useEffect, useState } from 'react';
import Map from '../../components/Map.js';
import RoverCam from "../../components/RoverCamera.js";
import '../../pages-style/rover.css';

function Rover() {
  const [roverData, setRoverData] = useState(null);
  const [message, setMessage] = useState(null);
  const [pinMessage, setPinMessage] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/get_rover_spec_scan');
      const data = await response.json();
      setRoverData(data);
    } catch (error) {
      console.error('Error fetching rover data:', error);
    }
  };

  const handleSaveSpec = async () => {
    try {
      const response = await fetch('http://localhost:8000/save_rover_spec', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error('Error saving spec:', error);
    }
  };

  const handleDropPin = async () => {
    try {
      const response = await fetch('http://localhost:8000/drop_pin_here/1', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setPinMessage(result.message);
    } catch (error) {
      console.error('Error dropping pin:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div id="page-container">
      <div id="left-column">
        <div id="rover-cam-container">
          <RoverCam />
        </div>
        <div id="map-container">
          <Map />
        </div>
      </div>
      <div id="right-column">
        <div id="data-container">
          {roverData ? (
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{roverData.name}</td>
                </tr>
                <tr>
                  <td>ID</td>
                  <td>{roverData.id}</td>
                </tr>
                {Object.entries(roverData.data).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            'Loading...'
          )}
        </div>
        <div id="button-container">
          <button className="action-button" onClick={handleSaveSpec}>Save Spec</button>
        </div>
        {message && <p>{message}</p>}
        {pinMessage && <p>{pinMessage}</p>}
      </div>
    </div>
  );
}

export default Rover;
