import React, { useState, useEffect } from 'react';
import '../../pages-style/page.css';
import '../../pages-style/setup.css';
import MapboxComponent from '../../components/Map.js';
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";  // Import mapboxgl here

function Setup() {
  const [tssIP, setTssIP] = useState('');
  const [holoIP, setHoloIP] = useState('');
  const [mapBoxAPI, setMapBoxAPI] = useState('');
  const [serverIP, setServerIP] = useState('');

  const [tssIPStatus, setTssIPStatus] = useState('yellow');
  const [holoIPStatus, setHoloIPStatus] = useState('yellow');
  const [serverIPStatus, setServerIPStatus] = useState('yellow');
  const [mapBoxAPIStatus, setMapBoxAPIStatus] = useState('yellow');

  const [showTssIPModal, setShowTssIPModal] = useState(false);
  const [showHoloIPModal, setShowHoloIPModal] = useState(false);
  const [showServerIPModal, setShowServerIPModal] = useState(false);
  const [showMapBoxAPIModal, setShowMapBoxAPIModal] = useState(false);


  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_config');
        const config = await response.json();
        setTssIP(config.TSS_IP);
        setHoloIP(config.HOLO_IP);
        setMapBoxAPI(config.MAPBOX_KEY);
        setServerIP(config.SERVER_IP);

        checkConnection(config.TSS_IP, setTssIPStatus, 'tss_ip');
        checkConnection(config.HOLO_IP, setHoloIPStatus, 'holo_ip');
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
      if (newConfig.HOLO_IP) checkConnection(newConfig.HOLO_IP, setHoloIPStatus, 'holo_ip');
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
      HOLO_IP: holoIP,
      SERVER_IP: serverIP,
    });
  };

  const handleSetSERVER_IP = () => {
    const inputSERVER_IP = document.getElementById('server_ip').value;
    setServerIP(inputSERVER_IP);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: mapBoxAPI,
      HOLO_IP: holoIP,
      SERVER_IP: inputSERVER_IP,
    });
  };

  const handleSetHOLO_IP = () => {
    const inputHOLO_IP = document.getElementById('holo_ip').value;
    setHoloIP(inputHOLO_IP);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: mapBoxAPI,
      HOLO_IP: inputHOLO_IP,
      SERVER_IP: serverIP,
    });
  };

  const handleSetMapBoxAPI = () => {
    const inputMapBox_API = document.getElementById('mapbox_api').value;
    setMapBoxAPI(inputMapBox_API);
    updateConfigOnServer({
      TSS_IP: tssIP,
      MAPBOX_KEY: inputMapBox_API,
      HOLO_IP: holoIP,
      SERVER_IP: serverIP,
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
          <label htmlFor='holo_ip'>HOLO Lens IP Address: </label>
          <input type='text' id='holo_ip' name='holo_ip' defaultValue={holoIP} />
          <button id="info-button" onClick={() => setShowHoloIPModal(true)}>?</button>
          <button onClick={handleSetHOLO_IP}>Set HOLO IP</button>
          <div className={`status ${holoIPStatus}`}>
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
      </div>
      <div style={{ display: 'none' }}>
        <MapboxComponent handleMapBoxAPIStatus={setMapBoxAPIStatus} />
      </div>

      <InfoModal showModal={showTssIPModal} setShowModal={setShowTssIPModal} content="The TSS IP Adress is needed so the server can receive information to update EVA data and positioning. If the TSS is running on the local machine, the IP is localhost:{port} (port is usually 14141). If the TSS is running on an external machine, find the exposed IP of that machine on the local network. Instructions for running the TSS can be found here: https://github.com/dignojrteogalbo/TSS_2024/tree/docker" />
      <InfoModal showModal={showServerIPModal} setShowModal={setShowServerIPModal} content="The Server must be running via Uvicorn to receive data. If the Server is running on the local machine, the IP is localhost:{port} (port is usually 8000). If the Server is running on an external machine, find the exposed IP of that machine on the local network. Instructions to run the server can be found here: https://github.com/columbiaspace/SUITS-23-24-LMCC" />
      <InfoModal showModal={showHoloIPModal} setShowModal={setShowHoloIPModal} content="The HOLO IP is found by asking the HoloLens 'What's my IP Adress?' or by going into network settings. The IP is necessary for video streaming" />
      <InfoModal showModal={showMapBoxAPIModal} setShowModal={setShowMapBoxAPIModal} content="The Mapbox API key was sent in the Slack channel, dm Jonah if necessary. You can also get your own key here: https://docs.mapbox.com/help/glossary/access-token/" />
    </div>
  );
}

export default Setup;