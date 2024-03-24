import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxComponent = () => {
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWRlbmpvbmFoIiwiYSI6ImNsdTV4MTV1bjF2MWcybW55cDh2YW1jNTcifQ.zhS3zKlwQf1tJBW6oQNvQQ';
        const map = new mapboxgl.Map({
            container: 'map', // Replace with your container element ID
            style: 'mapbox://styles/mapbox/satellite-v9', 
            center: [-95.08148549138448, 29.564911887991144], // Longitude, Latitude
            zoom: 17 // Adjust zoom level as needed
        });

        const addMarker = (e) => {
            new mapboxgl.Marker()
              .setLngLat(e.lngLat)
              .addTo(map);
        };
      
        // Add click event listener to the map
        map.on('click', addMarker);
    
        return () => map.remove(); // Clean up the map instance
    }, []);

    
    return (
        <div id="map" style={{ width: '100%', height: '400px' }}></div>
    );
};

export default MapboxComponent;