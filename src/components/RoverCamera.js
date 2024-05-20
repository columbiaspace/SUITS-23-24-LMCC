import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NoVid from "./../assets/Images/NoVid.png";
import './rovercamera.css'; // Import the CSS file

const RoverCamera = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [streamUrl, setStreamUrl] = useState('');
  const [isNativeFeed, setIsNativeFeed] = useState(true); // Track the current feed type

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

  const toggleFeed = () => {
    // Toggle the stream URL between native_feed and thermal_feed
    setStreamUrl((prevUrl) => 
      prevUrl.includes('native_feed') 
        ? prevUrl.replace('native_feed', 'thermal_feed') 
        : prevUrl.replace('thermal_feed', 'native_feed')
    );
    setIsNativeFeed(!isNativeFeed); // Toggle the feed type state
  };

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
    <div className="stream-container" onClick={toggleFeed}>
      <img src={streamUrl} alt="Rover Stream" className="stream-image" />
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
      </p>
    </div>
  );
};

export default RoverCamera;
