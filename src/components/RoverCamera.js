import React, { useEffect, useState, useRef } from 'react';

const RoverCamera = () => {
  const [mediaType, setMediaType] = useState(null);
  const [mediaSrc, setMediaSrc] = useState(null);
  const videoRef = useRef(null);
  const streamUrl = "https://mars.nasa.gov/system/resources/detail_files/25904_1-PIA24546-1200.jpg";

  useEffect(() => {
    // Determine if the URL is an image or a video
    if (/\.(jpg|jpeg|png|gif)$/i.test(streamUrl)) {
      setMediaType('image');
      setMediaSrc(streamUrl);
    } else if (/\.(mp4|webm|ogg)$/i.test(streamUrl)) {
      setMediaType('video');
      if (videoRef.current) {
        videoRef.current.src = streamUrl;
        videoRef.current.load();
        videoRef.current.play().catch(error => {
          console.error('Error playing the video:', error);
        });
      }
    }
  }, [streamUrl]);

  return (
    <>
      {mediaType === 'video' && (
        <video ref={videoRef} controls autoPlay muted playsInline />
      )}
      {mediaType === 'image' && (
        <img src={mediaSrc} alt="Mars Rover" />
      )}
    </>
  );
};

export default RoverCamera;
