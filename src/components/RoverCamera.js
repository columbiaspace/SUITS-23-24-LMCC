import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NoVid from "./../assets/Images/NoVid.png";
import './rovercamera.css'; // Import the CSS file

const RoverCamera = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [streamUrl, setStreamUrl] = useState('');

  useEffect(() => {
    // Fetch configuration data from localhost:8000/config
    fetch('http://localhost:8000/get_config')
      .then(response => response.json())
      .then(data => {
        setStreamUrl(`http://${data.ROVER_IP}:5000/native_feed`); // Set streamUrl from fetched Rover IP
        setIsConnected(true); // Set isConnected to true if data fetch is successful
      })
      .catch(error => {
        console.error('Error fetching configuration:', error);
        setIsConnected(false); // Set isConnected to false on error
      });
  }, []);

  if (!isConnected) {
    return (
      <div>
        <h1>HoloLens Not Connected</h1>
        <p style={{ textAlign: 'center' }}>To see stream, input the HoloLens IP in the Setup page <Link to="/Setup">here</Link>.</p>
        <img src={NoVid} alt="No Stream Icon" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', width: '200px', height: '200px' }}/>
      </div>
    );
  }

  return (
    <div className="stream-container">
      <img src={streamUrl} alt="Rover Stream" className="stream-image" />
    </div>
  );
};

export default RoverCamera;
