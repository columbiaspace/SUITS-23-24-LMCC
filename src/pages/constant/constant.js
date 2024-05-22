import React, { useState, useEffect, useRef } from 'react';
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
import DCUUIA from './DCUUIA'; // Import the new component

function Constant() {
  const [telemetryData, setTelemetryData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [selectedEV, setSelectedEV] = useState(parseInt(localStorage.getItem('selectedEV')) || 1);
  const [startId, setStartId] = useState(null);
  const [endId, setEndId] = useState(null);
  const intervalRef = useRef(null);

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

  useEffect(() => {
    if (startId && endId) {
      calculateShortestPath(startId, endId);
      intervalRef.current = setInterval(() => {
        calculateShortestPath(startId, endId);
      }, 3000);

      return () => clearInterval(intervalRef.current);
    }
  }, [startId, endId]);

  const calculateShortestPath = (startId, endId) => {
    const data = {
      start_id: startId,
      end_id: endId
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
        const distance = data.distance;
        if (distance < 10) {
          clearInterval(intervalRef.current);
        }
        console.log('Distance:', distance);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSubmit = (start, end) => {
    clearInterval(intervalRef.current);
    setStartId(start);
    setEndId(end);
  };

  const handleToggleEV = () => {
    const newEV = selectedEV === 1 ? 2 : 1;
    localStorage.setItem('selectedEV', newEV);
    setSelectedEV(newEV);
    window.location.reload(); // Refresh the page on switch
  };

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

  return (
    <GlobalProvider value={{ telemetryData, hasError }}>
      <div className="pagecontainer" id="constantpage">
        {telemetryData && !hasError && (
          <TopBar 
            telemetryData={telemetryData}
            getStatusClass={getStatusClass}
            formatTime={formatTime}
          />
        )}
        <div className="top-half">
          <div id="HMDStream"><StreamComponent evNumber={selectedEV} /></div>
          <div id="centerbar">
            <div className='centerButton' id='Alert' onClick={() => setAlertModalVisible(true)}>Alert</div>
            <div className='centerButton' id='MapButton' onClick={() => setMapModalVisible(true)}>Map</div>
            <div className='centerButton' id='ToggleEV' onClick={handleToggleEV}>
              {selectedEV === 1 ? 'Switch to EV2' : 'Switch to EV1'}
            </div>
          </div>
          <div id="RoverStream"><RoverCam /></div>
        </div>
        <div className="bottom-half">
          <div id="EV"><EVData evNumber={selectedEV} /></div>
          <div id="ConstantMap"><MapboxComponent zoom={18} /></div>
          <div id="UIADCU"><DCUUIA /></div> {/* Include the new component */}
        </div>
        <Modal
          isVisible={isAlertModalVisible}
          hideModal={() => setAlertModalVisible(false)}
          content={
            <p>None yet</p>
          }
        />
        <MapModal
          isVisible={isMapModalVisible}
          hideModal={() => setMapModalVisible(false)}
          handleSubmit={handleSubmit}
        />
      </div>
    </GlobalProvider>
  );
}

export default Constant;
