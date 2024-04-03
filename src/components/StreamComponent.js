import React, { useEffect, useRef } from 'react';
import { getHOLO_IP } from './../helpers/ipAddress.js';

const StreamComponent = () => {
  const videoRef = useRef(null);
  const HOLO_IP = getHOLO_IP(); // Assume this function returns the IP address correctly

  useEffect(() => {
    if (videoRef.current && HOLO_IP) {
      const streamUrl = `http://${HOLO_IP}/api/holographic/stream/live_high.mp4`;
      videoRef.current.src = streamUrl;
      videoRef.current.play().catch(error => {
        console.error('Error playing the video:', error);
      });
    }
  }, [HOLO_IP]);

  return (
    <video ref={videoRef} controls autoPlay muted />
  );
};

export default StreamComponent;
