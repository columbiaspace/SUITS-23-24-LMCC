import React, { useState } from 'react';
import { GlobalProvider } from '../../components/GlobalContext'; // Ensure this path is correct
import "./constant.css";
import StreamComponent from "../../components/StreamComponent.js";
import RoverCam from "../../components/RoverCamera.js";
import "../../pages-style/page.css";
import EVData from './EVData.js';
import Map from '../../components/Map.js';
import Modal from './Modal'; // Import the Modal component
import MapModal from './MapModal'; // Import the MapModal component

function Constant() {
  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [isMapModalVisible, setMapModalVisible] = useState(false);

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
        <div id="topbar"></div>
        <div id="centerbar">
          <div className='centerButton' id='Alert' onClick={showAlertModal}>Alert</div>
          <div className='centerButton' id='MapButton' onClick={showMapModal}>Map</div>
        </div>
        <div className="top-half">
          <div id="HMDStream"><StreamComponent /></div>
          <div id="RoverStream"><RoverCam /></div>
        </div>
        <div className="bottom-half">
          <div id="EV1"><EVData evNumber={1} /></div>
          <div id="Map"><Map /></div>
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
