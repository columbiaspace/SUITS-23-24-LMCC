import React, { useState } from 'react';
import { getTSS_IP, setTSS_IP, getHOLO_IP, setHOLO_IP } from '../helpers/ipAddress';

function Setup() {
  const [tssIP, setTssIP] = useState(getTSS_IP());
  const [holoIP, setHoloIP] = useState(getHOLO_IP());
  
  const handleSetTSS_IP = () => {
    const inputTSS_IP = document.getElementById("tss_ip").value;
    setTSS_IP(inputTSS_IP); 
    setTssIP(inputTSS_IP); 
  };

  // Function to handle setting the HOLO_IP
  const handleSetHOLO_IP = () => {
    const inputHOLO_IP = document.getElementById("holo_ip").value;
    setHOLO_IP(inputHOLO_IP); 
    setHoloIP(inputHOLO_IP); 
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
      <p>Current TSS IP Address: {tssIP}</p>
      <p>Current HOLO IP Address: {holoIP}</p>
    </div>
  );
}

export default Setup;
