import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NoVid from "./../assets/Images/NoVid.png";
import './streamcomponent.css'; // Import the CSS file

const StreamComponent = () => {
  const videoRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);
  const [HOLO_IP, setHOLO_IP] = useState(null); // Initialize HOLO_IP as null

  useEffect(() => {
    // Fetch configuration data from localhost:8000/get_config
    fetch('http://localhost:8000/get_config')
      .then(response => response.json())
      .then(data => {
        setHOLO_IP(data.HOLO_IP); // Set HOLO_IP from fetched data
      })
      .catch(error => {
        console.error('Error fetching configuration:', error);
        setIsConnected(false); // Set isConnected to false on error
      });
  }, []);

  useEffect(() => {
    if (videoRef.current && HOLO_IP) { // Check if HOLO_IP is available
      const streamUrl = `http://${HOLO_IP}/api/holographic/stream/live_high.mp4`;
      videoRef.current.src = streamUrl;
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.error('Error playing the video:', error);
        setIsConnected(false); // Set isConnected to false on error
      });
    }
  }, [HOLO_IP]);

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
      <video ref={videoRef} className="stream-video" controls autoPlay muted playsInline />
    </div>
  );
};

export default StreamComponent;
