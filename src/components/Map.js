import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { getMapBox_API } from "./../helpers/ipAddress.js";
import geoJson from "../assets/json_data/GeoJson/stagnentData.json";

const MapboxComponent = () => {
    const MapBoxAPIKey = getMapBox_API();
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [landmarks, setLandmarks] = useState([]);
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [showMarkers, setShowMarkers] = useState(true);
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

    useEffect(() => {
        mapboxgl.accessToken = MapBoxAPIKey;
        const newMap = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-95.08148549138448, 29.564911887991144],
            zoom: 15,
        });

        newMap.on('load', () => {
            // Load landmarks
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

            // Load geoJSON data
            newMap.addSource("geojson-source", {
                type: "geojson",
                data: geoJson,
            });

            geoJson.features.forEach((feature, index) => {
                if (feature.properties.mapbounds) return;
                const layerId = `${feature.geometry.type.toLowerCase()}-layer-${index}`;
                const layerType = feature.geometry.type === "Point" ? "circle" : feature.geometry.type === "LineString" ? "line" : "fill";

                newMap.addLayer({
                    id: layerId,
                    type: layerType,
                    source: "geojson-source",
                    filter: ["==", ["id"], feature.id],
                    paint: {
                        "circle-radius": 6,
                        "circle-color": feature.properties["marker-color"] || "#FF0000",
                        "fill-color": feature.properties.fill || "#888888",
                        "fill-opacity": feature.properties["fill-opacity"] || 0.5,
                        "line-color": feature.properties.stroke || "#888888",
                        "line-width": feature.properties["stroke-width"] || 2,
                    },
                });
            });
        });

        newMap.on('mousemove', (e) => {
            setCoordinates({ lat: e.lngLat.lat.toFixed(4), lng: e.lngLat.lng.toFixed(4) });
        });

        setMap(newMap);

        return () => {
            markers.forEach(marker => marker.marker.remove());
            landmarks.forEach(landmark => landmark.marker.remove());
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

            setMarkers(currentMarkers => [...currentMarkers, { marker, title, description, id: currentMarkers.length }]);
        });
    }, [map]);

    const toggleVisibility = () => {
        setShowMarkers(!showMarkers);
        markers.concat(landmarks).forEach(m => m.marker.getElement().style.display = showMarkers ? 'none' : 'block');
    };

    const handleSelectPoint = marker => {
        const updatedSelection = selectedPoints.includes(marker) ? selectedPoints.filter(p => p !== marker) : [...selectedPoints, marker];
        setSelectedPoints(updatedSelection.length > 2 ? updatedSelection.slice(1) : updatedSelection);
    };

    const displayMarkerInfo = (marker) => {
        alert(`Title: ${marker.title}\nDescription: ${marker.description}`);
    };

    const calculateRoute = () => {
        if (selectedPoints.length === 2) {
            const [start, end] = selectedPoints.map(m => m.marker.getLngLat());
            const route = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [[start.lng, start.lat], [end.lng, end.lat]]
                }
            };

            if (map.getSource('route')) {
                map.getSource('route').setData(route);
            } else {
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: route
                    },
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

    const cancelRoute = () => {
        if (map.getLayer('route')) {
            map.removeLayer('route');
            map.removeSource('route');
        }
        setSelectedPoints([]);
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
                <button onClick={toggleVisibility}>{showMarkers ? 'Hide' : 'Show'} Markers</button>
                <button onClick={calculateRoute}>Calculate Route</button>
                <button onClick={cancelRoute}>Cancel Route</button>
                {markers.concat(landmarks).map((marker, index) => (
                    <div key={index}
                        style={{ padding: '10px', backgroundColor: selectedPoints.includes(marker) ? 'lightblue' : 'white', cursor: 'pointer' }}
                        onClick={() => handleSelectPoint(marker)}
                        onDoubleClick={() => displayMarkerInfo(marker)}>
                        {marker.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapboxComponent;
