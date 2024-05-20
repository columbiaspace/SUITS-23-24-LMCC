import React, { useState, useEffect } from 'react';
import { GlobalProvider } from '../../components/GlobalContext'; 
import "./constant.css";
import StreamComponent from "../../components/StreamComponent.js";
import RoverCam from "../../components/RoverCamera.js";
import "../../pages-style/page.css";
import EVData from './EVData.js';
import MapboxComponent from '../../components/Map.js'; // Ensure this path is correct
import Modal from './Modal'; 
import MapModal from './MapModal';
import TopBar from './Topbar';

function Constant() {
  const [telemetryData, setTelemetryData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [isMapModalVisible, setMapModalVisible] = useState(false);

  useEffect(() => {
    const fetchTelemetryData = () => {
      fetch('http://localhost:8000/get_telemetry_data')
        .then(response => response.json())
        .then(data => {
          setTelemetryData(data);
          setHasError(false); // Reset error state if data fetch is successful
        })
        .catch(error => {
          console.error('Error fetching telemetry data:', error);
          setHasError(true); // Set error state if data fetch fails
        });
    };

    fetchTelemetryData();
    const interval = setInterval(fetchTelemetryData, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (started, completed) => {
    if (completed) return 'status-indicator green';
    if (started) return 'status-indicator yellow';
    return 'status-indicator red';
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const showAlertModal = () => setAlertModalVisible(true);
  const hideAlertModal = () => setAlertModalVisible(false);

  const showMapModal = () => setMapModalVisible(true);
  const hideMapModal = () => setMapModalVisible(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const start_id = event.target.start_id.value;
    const end_id = event.target.end_id.value;

    const data = {
      start_id: parseInt(start_id, 10),
      end_id: parseInt(end_id, 10)
    };

    fetch('http://localhost:8000/get_shortest_path', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Data submitted successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to submit data.');
      });

    hideAlertModal();
  };

  return (
    <GlobalProvider>
      <div className="pagecontainer" id="constantpage">
        {telemetryData && !hasError && (
          <TopBar 
            telemetryData={telemetryData}
            getStatusClass={getStatusClass}
            formatTime={formatTime}
          />
        )}
        <div className="top-half">
          <div id="HMDStream"><StreamComponent /></div>
          <div id="centerbar">
            <div className='centerButton' id='Alert' onClick={showAlertModal}>Alert</div>
            <div className='centerButton' id='MapButton' onClick={showMapModal}>Map</div>
          </div>
          <div id="RoverStream"><RoverCam /></div>
        </div>
        <div className="bottom-half">
          <div id="EV1"><EVData evNumber={1} /></div>
          <div id="ConstantMap"><MapboxComponent /></div>
          <div id="EV2"><EVData evNumber={2} /></div>
        </div>
        <Modal
          isVisible={isAlertModalVisible}
          hideModal={hideAlertModal}
          content={
            <p>None yet</p>
          }
        />
        <MapModal
          isVisible={isMapModalVisible}
          hideModal={hideMapModal}
          handleSubmit={handleSubmit}
        />
      </div>
    </GlobalProvider>
  );
}

export default Constant;
