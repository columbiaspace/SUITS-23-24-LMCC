import React, { useState } from 'react';
import { getTSS_IP, setTSS_IP, getHOLO_IP, setHOLO_IP, getMapBox_API, setMapBox_API, getSERVER_IP, setSERVER_IP } from '../../helpers/ipAddress';
import '../../pages-style/page.css';
import '../../pages-style/setup.css';

function Setup() {
  const [, setTssIP] = useState(getTSS_IP());
  const [, setHoloIP] = useState(getHOLO_IP());
  const [, setMapBoxAPI] = useState(getMapBox_API());
  const [, setServerIP] = useState(getSERVER_IP());

  const updateConfigOnServer = async (newConfig) => {
    try {
      const response = await fetch('http://localhost:8000/update_config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const handleSetTSS_IP = () => {
    const inputTSS_IP = document.getElementById('tss_ip').value;
    setTSS_IP(inputTSS_IP);
    setTssIP(inputTSS_IP);
    updateConfigOnServer({
      TSS_IP: inputTSS_IP,
      MAPBOX_KEY: getMapBox_API(),
      HOLO_IP: getHOLO_IP(),
    });
  };

  const handleSetSERVER_IP = () => {
    const inputSERVER_IP = document.getElementById('server_ip').value;
    setSERVER_IP(inputSERVER_IP);
    setServerIP(inputSERVER_IP);
    // Update the config file accordingly if SERVER_IP needs to be added
  };

  const handleSetHOLO_IP = () => {
    const inputHOLO_IP = document.getElementById('holo_ip').value;
    setHOLO_IP(inputHOLO_IP);
    setHoloIP(inputHOLO_IP);
    updateConfigOnServer({
      TSS_IP: getTSS_IP(),
      MAPBOX_KEY: getMapBox_API(),
      HOLO_IP: inputHOLO_IP,
    });
  };

  const handleSetMapBoxAPI = () => {
    const inputMapBox_API = document.getElementById('mapbox_api').value;
    setMapBox_API(inputMapBox_API);
    setMapBoxAPI(inputMapBox_API);
    updateConfigOnServer({
      TSS_IP: getTSS_IP(),
      MAPBOX_KEY: inputMapBox_API,
      HOLO_IP: getHOLO_IP(),
    });
  };

  return (
    <div className='pagecontainer' id='setup'>
      <div className='header'>
        <h1>Setup</h1>
      </div>
      <div className='entryBoxes'>
        <div className='dataEntry'>
          <label htmlFor='tss_ip'>TSS IP Address: </label>
          <input type='text' id='tss_ip' name='tss_ip' defaultValue={getTSS_IP()} />
          <button onClick={handleSetTSS_IP}>Set TSS IP</button>
        </div>
        <div className='dataEntry'>
          <label htmlFor='server_ip'>Server IP Address:</label>
          <input type='text' id='server_ip' name='server_ip' defaultValue={getSERVER_IP()} />
          <button onClick={handleSetSERVER_IP}>Set Server IP</button>
        </div>
        <div className='dataEntry'>
          <label htmlFor='holo_ip'>HOLO Lens IP Address: </label>
          <input type='text' id='holo_ip' name='holo_ip' defaultValue={getHOLO_IP()} />
          <button onClick={handleSetHOLO_IP}>Set HOLO IP</button>
        </div>
        <div className='dataEntry'>
          <label htmlFor='mapbox_api'>Map Box API Key: </label>
          <input type='text' id='mapbox_api' name='mapbox_api' defaultValue={getMapBox_API()} />
          <button onClick={handleSetMapBoxAPI}>Set MapBox API Key</button>
        </div>
      </div>
    </div>
  );
}

export default Setup;
