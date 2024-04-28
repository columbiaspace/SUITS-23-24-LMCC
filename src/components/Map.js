import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapBox_API } from './../helpers/ipAddress.js';

const MapboxComponent = () => {
    const MapBoxAPIKey = getMapBox_API();
    const [map, setMap] = useState(null);
    const [userMarkers, setUserMarkers] = useState([]);
    const [landmarks, setLandmarks] = useState([]);
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [showUserMarkers, setShowUserMarkers] = useState(true);
    const [showLandmarks, setShowLandmarks] = useState(true);
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

    useEffect(() => {
        mapboxgl.accessToken = MapBoxAPIKey;
        const newMap = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-95.08148549138448, 29.564911887991144],
            zoom: 15
        });

        newMap.on('load', () => {
            setLandmarks([
                { id: 'landmark1', title: 'Eiffel Tower', lat: 48.8584, lng: 2.2945, description: 'A wrought-iron lattice tower on the Champ de Mars in Paris, France.' },
                { id: 'landmark2', title: 'Statue of Liberty', lat: 40.6892, lng: -74.0445, description: 'A colossal statue on Liberty Island in New York Harbor.' }
            ].map(landmark => {
                const marker = new mapboxgl.Marker()
                    .setLngLat([landmark.lng, landmark.lat])
                    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${landmark.title}</h3><p>${landmark.description}</p>`))
                    .addTo(newMap);
                return { ...landmark, marker };
            }));
        });

        newMap.on('mousemove', (e) => {
            setCoordinates({ lat: e.lngLat.lat.toFixed(4), lng: e.lngLat.lng.toFixed(4) });
        });

        setMap(newMap);

        return () => {
            userMarkers.forEach(marker => marker.remove());
            newMap.remove();
        };
    }, []);

    useEffect(() => {
        if (!map) return;
        map.on('click', (e) => {
            const title = prompt("Enter title for the marker:");
            const description = prompt("Enter description for the marker:");
            if (!title || !description) return;

            const marker = new mapboxgl.Marker()
                .setLngLat([e.lngLat.lng, e.lngLat.lat])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${title}</h3><p>${description}</p>`))
                .addTo(map);

            setUserMarkers(currentMarkers => [...currentMarkers, { marker, title, description, id: currentMarkers.length }]);
        });
    }, [map]);

    const toggleVisibility = (type) => {
        if (type === 'userMarkers') {
            setShowUserMarkers(!showUserMarkers);
            userMarkers.forEach(m => m.marker.getElement().style.display = showUserMarkers ? 'none' : 'block');
        } else {
            setShowLandmarks(!showLandmarks);
            landmarks.forEach(l => l.marker.getElement().style.display = showLandmarks ? 'none' : 'block');
        }
    };

    const drawRoute = () => {
        if (selectedPoints.length === 2) {
            const [start, end] = selectedPoints.map(m => m.marker.getLngLat());
            const route = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: [[start.lng, start.lat], [end.lng, end.lat]]
                }
            };

            if (map.getSource('route')) {
                map.getSource('route').setData(route);
            } else {
                map.addSource('route', { type: 'geojson', data: route });
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#ff7e5f',
                        'line-width': 5,
                        'line-opacity': 0.75
                    }
                });
            }
        } else {
            alert('Please select exactly two markers to draw a route.');
        }
    };

    const displayMarkerInfo = (marker) => {
        alert(`Title: ${marker.title}\nDescription: ${marker.description}`);
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div id="map" style={{ flex: 1, position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    margin: '10px',
                    padding: '5px 10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    zIndex: 1,
                    fontSize: '12px'
                }}>
                    {`Lat: ${coordinates.lat}, Lng: ${coordinates.lng}`}
                </div>
            </div>
            <div style={{ width: '250px', overflowY: 'auto' }}>
                <button onClick={() => toggleVisibility('userMarkers')}>{showUserMarkers ? 'Hide' : 'Show'} User Markers</button>
                <button onClick={() => toggleVisibility('landmarks')}>{showLandmarks ? 'Hide' : 'Show'} Landmarks</button>
                <button onClick={drawRoute}>Draw Route</button>
                {userMarkers.concat(landmarks).map((marker, index) => (
                    <div key={index}
                        style={{ padding: '10px', backgroundColor: selectedPoints.includes(marker) ? 'lightblue' : 'white', cursor: 'pointer' }}
                        onClick={() => setSelectedPoints(prev => prev.includes(marker) ? prev.filter(p => p !== marker) : [...prev, marker])}
                        onDoubleClick={() => displayMarkerInfo(marker)}>
                        {marker.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapboxComponent;
