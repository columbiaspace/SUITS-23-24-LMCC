import React, { useState, useEffect } from 'react';
import { getTSS_IP, setTSS_IP, getHOLO_IP, setHOLO_IP, getMapBox_API, setMapBox_API } from '../helpers/ipAddress';

function Setup() {
  const [tssIP, setTssIP] = useState(getTSS_IP());
  const [holoIP, setHoloIP] = useState(getHOLO_IP());
  const [mapboxAPI, setMapBoxAPI] = useState(getMapBox_API());
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch('http://localhost:8000/json_data/teams/0/EVA.json');
        const data = await response.json();
        setTimer(data.eva.total_time);
      } catch (error) {
        console.error("Failed to fetch time data:", error);
      }
    };

    fetchTime();
    const interval = setInterval(fetchTime, 500); // Update every 0.5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSetTSS_IP = () => {
    const inputTSS_IP = document.getElementById("tss_ip").value;
    setTSS_IP(inputTSS_IP);
    setTssIP(inputTSS_IP);
  };

  const handleSetHOLO_IP = () => {
    const inputHOLO_IP = document.getElementById("holo_ip").value;
    setHOLO_IP(inputHOLO_IP);
    setHoloIP(inputHOLO_IP);
  };

  const handleSetMapBoxAPI = () => {
    const inputMapBox_API = document.getElementById("mapbox_api").value;
    setMapBox_API(inputMapBox_API);
    setMapBoxAPI(inputMapBox_API);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <h1>Setup</h1>
      <p>This page will be the landing page for the Setup display, and should explain the point of the Setup display</p>
      <label htmlFor="tss_ip">TSS IP Address: </label>
      <input type="text" id="tss_ip" name="tss_ip" defaultValue={tssIP} />
      <button onClick={handleSetTSS_IP}>Set TSS IP</button>
      <label htmlFor="holo_ip">HOLO IP Address: </label>
      <input type="text" id="holo_ip" name="holo_ip" defaultValue={holoIP} />
      <button onClick={handleSetHOLO_IP}>Set HOLO IP</button>
      <label htmlFor="mapbox_api">Map Box API Key: </label>
      <input type="text" id="mapbox_api" name="mapbox_api" defaultValue={mapboxAPI} />
      <button onClick={handleSetMapBoxAPI}>Set MapBox API Key</button>
      <p>Current TSS IP Address: {tssIP}</p>
      <p>Current HOLO IP Address: {holoIP}</p>
      <p>Current Map Box API Key: {mapboxAPI}</p>
      <p>Mission Timer: {formatTime(timer)}</p>
    </div>
  );
}

export default Setup;
