import React, { useEffect, useRef, useState } from 'react';
import { getHOLO_IP } from './../helpers/ipAddress.js';

const StreamComponent = () => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [setStreamed] = useState(false); // Track whether the video has streamed
  const HOLO_IP = getHOLO_IP(); 

  useEffect(() => {
    const video = videoRef.current;

    const handleCanPlayThrough = () => {
      setIsLoading(false);
      setStreamed(true);
      if (video && video.paused) {
        video.play().catch(error => {
          console.error('Error playing the video:', error);
        });
      }
    };

    if (video && HOLO_IP && isLoading) {
      video.addEventListener('canplaythrough', handleCanPlayThrough);
      setIsLoading(true);

      const streamUrl = `http://${HOLO_IP}/api/holographic/stream/live_high.mp4`;
      video.src = streamUrl;
    }

    return () => {
      if (video) {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
      }
    };
  }, [HOLO_IP, isLoading, setStreamed]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch(error => {
        console.error('Error playing the video:', error);
      });
    }
  };

  return (
    <>
      <video ref={videoRef} alt={"Video Stream"} onClick={handleVideoClick} />
    </>
  );
};

export default StreamComponent;
