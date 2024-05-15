import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxComponent = ({ handleMapBoxAPIStatus }) => {
  const [mapBoxAPIKey, setMapBoxAPIKey] = useState(null);

  useEffect(() => {
    const fetchMapBoxAPIKey = async () => {
      try {
        const response = await fetch("http://localhost:8000/get_mapbox_key");
        const data = await response.json();
        setMapBoxAPIKey(data.MAPBOX_KEY);
        checkMapboxAPIKey(data.MAPBOX_KEY);
      } catch (error) {
        console.error("Error fetching MapBox API key:", error);
        handleMapBoxAPIStatus("red");
      }
    };

    fetchMapBoxAPIKey();
  }, [handleMapBoxAPIStatus]);

  const checkMapboxAPIKey = (key) => {
    handleMapBoxAPIStatus('yellow'); // Set to yellow while checking
    const tempDiv = document.createElement('div');
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);

    const map = new mapboxgl.Map({
      container: tempDiv,
      accessToken: key,
    });

    map.on('load', () => {
      handleMapBoxAPIStatus('green');
      map.remove();
      document.body.removeChild(tempDiv);
    });

    map.on('error', () => {
      handleMapBoxAPIStatus('red');
      map.remove();
      document.body.removeChild(tempDiv);
    });
  };

  return null;
};

export default MapboxComponent;
