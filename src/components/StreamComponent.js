import React, { useEffect, useRef, useState } from 'react';

const StreamComponent = () => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [streamed, setStreamed] = useState(false); // Track whether the video has streamed

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

    if (video && ipAddress && isLoading) {
      video.addEventListener('canplaythrough', handleCanPlayThrough);
      setIsLoading(true);

      const streamUrl = `http://${ipAddress}/api/holographic/stream/live_high.mp4`;
      video.src = streamUrl;
    }

    return () => {
      if (video) {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
      }
    };
  }, [ipAddress, isLoading]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch(error => {
        console.error('Error playing the video:', error);
      });
    }
  };

  const handleInputChange = (event) => {
    setIpAddress(event.target.value);
    setStreamed(false); // Reset streamed state when the input changes
  };

  const handleOkButtonClick = () => {
    setIsLoading(true);
    setStreamed(false); // Reset streamed state when the OK button is pressed
  };

  return (
    <>
      {!streamed && (
        <>
          <input
            type="text"
            placeholder="Enter IP address"
            value={ipAddress}
            onChange={handleInputChange}
          />
          <button onClick={handleOkButtonClick}>OK</button>
        </>
      )}

      {isLoading && !streamed && <div>Loading...</div>}

      <video ref={videoRef} alt={"Video Stream"} onClick={handleVideoClick} />
    </>
  );
};

export default StreamComponent;
