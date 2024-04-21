import React, { useEffect, useRef, useState } from 'react';
import { getHOLO_IP } from './../helpers/ipAddress.js';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NoVid from "./../assets/Images/NoVid.jpg"

const StreamComponent = () => {
  const videoRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);
  const HOLO_IP = getHOLO_IP(); // Assume this function returns the IP address correctly

  useEffect(() => {
    if (videoRef.current && HOLO_IP) {
      const streamUrl = `http://${HOLO_IP}/api/holographic/stream/live_high.mp4`;
      videoRef.current.src = streamUrl;
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.error('Error playing the video:', error);
        setIsConnected(false); // Set isConnected to false on error
      });
    } else {
      setIsConnected(false); // Set isConnected to false if HOLO_IP is not set
    }
  }, [HOLO_IP]);

  if (!isConnected) {
    return (
      <div>
        <h1>HoloLens Not Connected</h1>
        <p style={{ textAlign: 'center' }}>To see stream, input the HoloLens IP in the Setup page <Link to="/Setup">here</Link>.</p>
        <img src={NoVid} alt="No Stream Icon" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '200px', height: '200px' }}/>
      </div>
    );
  }

  return (
    <video ref={videoRef} controls autoPlay muted playsInline />
  );
};

export default StreamComponent;
