import React, { useState, useEffect } from 'react';
import '../../pages-style/page.css';
import '../../pages-style/setup.css';
import MapboxComponent from '../../components/Map.js';
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";  // Import mapboxgl here

function Setup() {
  const [tssIP, setTssIP] = useState('');
  const [ev1HoloIP, setEv1HoloIP] = useState('');
  const [ev2HoloIP, setEv2HoloIP] = useState('');
  const [mapBoxAPI, setMapBoxAPI] = useState('');
  const [serverIP, setServerIP] = useState('');
  const [ev1TeamID, setEv1TeamID] = useState('');
  const [ev2TeamID, setEv2TeamID] = useState('');
  const [roverIP, setRoverIP] = useState('');

  const [tssIPStatus, setTssIPStatus] = useState('yellow');
  const [ev1HoloIPStatus, setEv1HoloIPStatus] = useState('yellow');
  const [ev2HoloIPStatus, setEv2HoloIPStatus] = useState('yellow');
  const [serverIPStatus, setServerIPStatus] = useState('yellow');
  const [mapBoxAPIStatus, setMapBoxAPIStatus] = useState('yellow');

  const [showTssIPModal, setShowTssIPModal] = useState(false);
  const [showEv1HoloIPModal, setShowEv1HoloIPModal] = useState(false);
  const [showEv2HoloIPModal, setShowEv2HoloIPModal] = useState(false);
  const [showServerIPModal, setShowServerIPModal] = useState(false);
  const [showMapBoxAPIModal, setShowMapBoxAPIModal] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_config');
        const config = await response.json();
        setTssIP(config.TSS_IP);
        setEv1HoloIP(config.EV1_HOLO_IP);
        setEv2HoloIP(config.EV2_HOLO_IP);
        setMapBoxAPI(config.MAPBOX_KEY);
        setServerIP(config.SERVER_IP);
        setEv1TeamID(config.EV1_TEAM_ID);
        setEv2TeamID(config.EV2_TEAM_ID);
        setRoverIP(config.ROVER_IP);

        checkConnection(config.TSS_IP, setTssIPStatus, 'tss_ip');
        checkConnection(config.EV1_HOLO_IP, setEv1HoloIPStatus, 'ev1_holo_ip');
        checkConnection(config.EV2_HOLO_IP, setEv2HoloIPStatus, 'ev2_holo_ip');
        checkConnection(config.SERVER_IP, setServerIPStatus, 'server_ip');
        // Check Mapbox API Key
        checkMapboxAPIKey(config.MAPBOX_KEY);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  const checkConnection = async (key, setStatus, type) => {
    try {
      const response = await fetch(`http://localhost:8000/check_connection?${type}=${key}`);
      const result = await response.json();
      if (result.status === 'connected') {
        setStatus('green');
      } else {
        setStatus('red');
      }
    } catch (error) {
      setStatus('red');
    }
  };

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

      if (newConfig.TSS_IP) checkConnection(newConfig.TSS_IP, setTssIPStatus, 'tss_ip');
      if (newConfig.EV1_HOLO_IP) checkConnection(newConfig.EV1_HOLO_IP, setEv1HoloIPStatus, 'ev1_holo_ip');
      if (newConfig.EV2_HOLO_IP) checkConnection(newConfig.EV2_HOLO_IP, setEv2HoloIPStatus, 'ev2_holo_ip');
      if (newConfig.SERVER_IP) checkConnection(newConfig.SERVER_IP, setServerIPStatus, 'server_ip');
      if (newConfig.MAPBOX_KEY) {
        checkMapboxAPIKey(newConfig.MAPBOX_KEY);
      }
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const checkMapboxAPIKey = (key) => {
    setMapBoxAPIStatus('yellow'); // Set to yellow while checking
    const tempDiv = document.createElement('div');
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);

    const map = new mapboxgl.Map({
      container: tempDiv,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
      accessToken: key,
    });

    map.on('load', () => {
      setMapBoxAPIStatus('green');
      map.remove();
      document.body.removeChild(tempDiv);
    });

    map.on('error', () => {
      setMapBoxAPIStatus('red');
      map.remove();
      document.body.removeChild(tempDiv);
    });
  };

  const handleSetTSS_IP = () => {
    const inputTSS_IP = document.getElementById('tss_ip').value;
    setTssIP(inputTSS_IP);
    updateConfigOnServer({
      TSS_IP: inputTSS_IP,
      MAPBOX_KEY: mapBoxAPI,
      EV1_HOLO_IP: ev1HoloIP,
      EV2_HOLO_IP: ev2HoloIP,
      SERVER_IP: serverIP,
      EV1_TEAM_ID: ev1TeamID,
      EV2_TEAM_ID: ev2TeamID,
      ROVER_IP: roverIP,
    });
  };

  const handleSetSERVER_IP = () => {
    const inputSERVER_IP = document.getElementById('server_ip').value;
    setServerIP(inputSERVER_IP);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: mapBoxAPI,
      EV1_HOLO_IP: ev1HoloIP,
      EV2_HOLO_IP: ev2HoloIP,
      SERVER_IP: inputSERVER_IP,
      EV1_TEAM_ID: ev1TeamID,
      EV2_TEAM_ID: ev2TeamID,
      ROVER_IP: roverIP,
    });
  };

  const handleSetEV1_HOLO_IP = () => {
    const inputEV1_HOLO_IP = document.getElementById('ev1_holo_ip').value;
    setEv1HoloIP(inputEV1_HOLO_IP);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: mapBoxAPI,
      EV1_HOLO_IP: inputEV1_HOLO_IP,
      EV2_HOLO_IP: ev2HoloIP,
      SERVER_IP: serverIP,
      EV1_TEAM_ID: ev1TeamID,
      EV2_TEAM_ID: ev2TeamID,
      ROVER_IP: roverIP,
    });
  };

  const handleSetEV2_HOLO_IP = () => {
    const inputEV2_HOLO_IP = document.getElementById('ev2_holo_ip').value;
    setEv2HoloIP(inputEV2_HOLO_IP);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: mapBoxAPI,
      EV1_HOLO_IP: ev1HoloIP,
      EV2_HOLO_IP: inputEV2_HOLO_IP,
      SERVER_IP: serverIP,
      EV1_TEAM_ID: ev1TeamID,
      EV2_TEAM_ID: ev2TeamID,
      ROVER_IP: roverIP,
    });
  };

  const handleSetMapBoxAPI = () => {
    const inputMapBox_API = document.getElementById('mapbox_api').value;
    setMapBoxAPI(inputMapBox_API);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: inputMapBox_API,
      EV1_HOLO_IP: ev1HoloIP,
      EV2_HOLO_IP: ev2HoloIP,
      SERVER_IP: serverIP,
      EV1_TEAM_ID: ev1TeamID,
      EV2_TEAM_ID: ev2TeamID,
      ROVER_IP: roverIP,
    });
  };

  const handleSetEV1TeamID = () => {
    const inputEV1TeamID = document.getElementById('ev1_team_id').value;
    setEv1TeamID(inputEV1TeamID);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: mapBoxAPI,
      EV1_HOLO_IP: ev1HoloIP,
      EV2_HOLO_IP: ev2HoloIP,
      SERVER_IP: serverIP,
      EV1_TEAM_ID: inputEV1TeamID,
      EV2_TEAM_ID: ev2TeamID,
      ROVER_IP: roverIP,
    });
  };

  const handleSetEV2TeamID = () => {
    const inputEV2TeamID = document.getElementById('ev2_team_id').value;
    setEv2TeamID(inputEV2TeamID);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: mapBoxAPI,
      EV1_HOLO_IP: ev1HoloIP,
      EV2_HOLO_IP: ev2HoloIP,
      SERVER_IP: serverIP,
      EV1_TEAM_ID: ev1TeamID,
      EV2_TEAM_ID: inputEV2TeamID,
      ROVER_IP: roverIP,
    });
  };

  const handleSetRoverIP = () => {
    const inputRoverIP = document.getElementById('rover_ip').value;
    setRoverIP(inputRoverIP);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: mapBoxAPI,
      EV1_HOLO_IP: ev1HoloIP,
      EV2_HOLO_IP: ev2HoloIP,
      SERVER_IP: serverIP,
      EV1_TEAM_ID: ev1TeamID,
      EV2_TEAM_ID: ev2TeamID,
      ROVER_IP: inputRoverIP,
    });
  };

  const InfoModal = ({ showModal, setShowModal, content }) => {
    return (
      <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-content" id="info-modal-content">
          <span className="close" onClick={() => setShowModal(false)}>&times;</span>
          <p id='InfoText'>{content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className='pagecontainer' id='setup'>
      <div className='header'>
        <h1>Setup</h1>
      </div>
      <div className='entryBoxes'>
        <div className='dataEntry'>
          <label htmlFor='tss_ip'>TSS IP Address: </label>
          <input type='text' id='tss_ip' name='tss_ip' defaultValue={tssIP} />
          <button id="info-button" onClick={() => setShowTssIPModal(true)}>?</button>
          <button onClick={handleSetTSS_IP}>Set TSS IP</button>
          <div className={`status ${tssIPStatus}`}>
            <span className="status-text"></span>
          </div>
        </div>
        <div className='dataEntry'>
          <label htmlFor='server_ip'>Server IP Address:</label>
          <input type='text' id='server_ip' name='server_ip' defaultValue={serverIP} />
          <button id="info-button" onClick={() => setShowServerIPModal(true)}>?</button>
          <button onClick={handleSetSERVER_IP}>Set Server IP</button>
          <div className={`status ${serverIPStatus}`}>
            <span className="status-text"></span>
          </div>
        </div>
        <div className='dataEntry'>
          <label htmlFor='ev1_holo_ip'>EV1 HoloLens IP Address: </label>
          <input type='text' id='ev1_holo_ip' name='ev1_holo_ip' defaultValue={ev1HoloIP} />
          <button id="info-button" onClick={() => setShowEv1HoloIPModal(true)}>?</button>
          <button onClick={handleSetEV1_HOLO_IP}>Set EV1 HoloLens IP</button>
          <div className={`status ${ev1HoloIPStatus}`}>
            <span className="status-text"></span>
          </div>
        </div>
        <div className='dataEntry'>
          <label htmlFor='ev2_holo_ip'>EV2 HoloLens IP Address: </label>
          <input type='text' id='ev2_holo_ip' name='ev2_holo_ip' defaultValue={ev2HoloIP} />
          <button id="info-button" onClick={() => setShowEv2HoloIPModal(true)}>?</button>
          <button onClick={handleSetEV2_HOLO_IP}>Set EV2 HoloLens IP</button>
          <div className={`status ${ev2HoloIPStatus}`}>
            <span className="status-text"></span>
          </div>
        </div>
        <div className='dataEntry'>
          <label htmlFor='mapbox_api'>Map Box API Key: </label>
          <input type='text' id='mapbox_api' name='mapbox_api' defaultValue={mapBoxAPI} />
          <button id="info-button" onClick={() => setShowMapBoxAPIModal(true)}>?</button>
          <button onClick={handleSetMapBoxAPI}>Set MapBox API Key</button>
          <div className={`status ${mapBoxAPIStatus}`}>
            <span className="status-text"></span>
          </div>
        </div>
        <div className='dataEntry'>
          <label htmlFor='ev1_team_id'>EV1 Team ID: </label>
          <input type='text' id='ev1_team_id' name='ev1_team_id' defaultValue={ev1TeamID} />
          <button onClick={handleSetEV1TeamID}>Set EV1 Team ID</button>
        </div>
        <div className='dataEntry'>
          <label htmlFor='ev2_team_id'>EV2 Team ID: </label>
          <input type='text' id='ev2_team_id' name='ev2_team_id' defaultValue={ev2TeamID} />
          <button onClick={handleSetEV2TeamID}>Set EV2 Team ID</button>
        </div>
        <div className='dataEntry'>
          <label htmlFor='rover_ip'>Rover IP Address: </label>
          <input type='text' id='rover_ip' name='rover_ip' defaultValue={roverIP} />
          <button onClick={handleSetRoverIP}>Set Rover IP</button>
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <MapboxComponent handleMapBoxAPIStatus={setMapBoxAPIStatus} />
      </div>

      <InfoModal showModal={showTssIPModal} setShowModal={setShowTssIPModal} content="The TSS IP Address is needed so the server can receive information to update EVA data and positioning. If the TSS is running on the local machine, the IP is localhost:{port} (port is usually 14141). If the TSS is running on an external machine, find the exposed IP of that machine on the local network. Instructions for running the TSS can be found here: https://github.com/dignojrteogalbo/TSS_2024/tree/docker" />
      <InfoModal showModal={showServerIPModal} setShowModal={setShowServerIPModal} content="The Server must be running via Uvicorn to receive data. If the Server is running on the local machine, the IP is localhost:{port} (port is usually 8000). If the Server is running on an external machine, find the exposed IP of that machine on the local network. Instructions to run the server can be found here: https://github.com/columbiaspace/SUITS-23-24-LMCC" />
      <InfoModal showModal={showEv1HoloIPModal} setShowModal={setShowEv1HoloIPModal} content="The EV1 HoloLens IP is found by asking the HoloLens 'What's my IP Address?' or by going into network settings. The IP is necessary for video streaming" />
      <InfoModal showModal={showEv2HoloIPModal} setShowModal={setShowEv2HoloIPModal} content="The EV2 HoloLens IP is found by asking the HoloLens 'What's my IP Address?' or by going into network settings. The IP is necessary for video streaming" />
      <InfoModal showModal={showMapBoxAPIModal} setShowModal={setShowMapBoxAPIModal} content="The Mapbox API key was sent in the Slack channel, dm Jonah if necessary. You can also get your own key here: https://docs.mapbox.com/help/glossary/access-token/" />
    </div>
  );
}

export default Setup;
