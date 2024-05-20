// MapboxComponent.js
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";
import './map.css';
import AddPointModal from '../pages/constant/AddPointModal'; // Ensure this path is correct

const MapboxComponent = () => {
  const [mapBoxAPIKey, setMapBoxAPIKey] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [clickCoordinates, setClickCoordinates] = useState(null);

  const fetchMapBoxAPIKey = async () => {
    try {
      const response = await fetch("http://localhost:8000/get_config");
      const data = await response.json();
      setMapBoxAPIKey(data.MAPBOX_KEY);
    } catch (error) {
      console.error("Error fetching MapBox API key:", error);
    }
  };

  useEffect(() => {
    fetchMapBoxAPIKey();
  }, []);

  useEffect(() => {
    if (mapBoxAPIKey) {
      mapboxgl.accessToken = mapBoxAPIKey;
      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/satellite-v8",
        center: [-95.08148549138448, 29.564911887991144],
        zoom: 17,
      });

      newMap.on("load", () => {
        newMap.addSource("geojson-source", {
          type: "geojson",
          data: null,
        });

        newMap.addLayer({
          id: "points",
          type: "circle",
          source: "geojson-source",
          filter: ["==", "$type", "Point"],
          paint: {
            "circle-color": "#FF0000",
            "circle-radius": 5,
          },
        });

        newMap.addLayer({
          id: "lines",
          type: "line",
          source: "geojson-source",
          filter: ["==", "$type", "LineString"],
          paint: {
            "line-color": "#0000FF",
            "line-width": 2,
          },
        });

        newMap.addLayer({
          id: "polygons",
          type: "fill",
          source: "geojson-source",
          filter: ["==", "$type", "Polygon"],
          paint: {
            "fill-opacity": 0,
          },
        });

        newMap.addLayer({
          id: "polygon-borders",
          type: "line",
          source: "geojson-source",
          filter: ["==", "$type", "Polygon"],
          paint: {
            "line-color": "#000000",
            "line-width": 1,
          },
        });

        newMap.addLayer({
          id: "point-labels",
          type: "symbol",
          source: "geojson-source",
          filter: ["==", "$type", "Point"],
          layout: {
            "text-field": ["to-string", ["get", "id"]],
            "text-offset": [0, 1.5],
            "text-anchor": "top",
          },
          paint: {
            "text-color": "#007bff",
            "text-halo-color": "#FFFFFF",
            "text-halo-width": 1,
          },
        });

        const fetchGeoJSON = async () => {
          try {
            const response = await fetch("http://localhost:8000/get_geojson");
            const geojsonData = await response.json();
            console.log("GeoJSON Features:", geojsonData.features);
            newMap.getSource("geojson-source").setData(geojsonData);
          } catch (error) {
            console.error("Error fetching geoJSON data:", error);
          }
        };

        fetchGeoJSON();
        const intervalId = setInterval(fetchGeoJSON, 3000);
        return () => clearInterval(intervalId);
      });

      newMap.on('click', (e) => {
        setClickCoordinates([e.lngLat.lng, e.lngLat.lat]);
        setModalVisible(true);
      });
    }
  }, [mapBoxAPIKey]);

  const hideModal = () => setModalVisible(false);

  const handleAddPoint = async ({ name, id, coordinates }) => {
    const newFeature = {
      type: "Feature",
      properties: {
        Name: name,
        "marker-color": "#f4aeae",
        "marker-size": "medium",
        "marker-symbol": "circle"
      },
      geometry: {
        type: "Point",
        coordinates
      },
      id: parseInt(id, 10)
    };

    try {
      const response = await fetch('http://localhost:8000/add_feature', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFeature)
      });

      if (response.ok) {
        console.log('Point added successfully');
      } else {
        console.error('Failed to add point');
      }
    } catch (error) {
      console.error('Error adding point:', error);
    }
  };

  return (
    <div className="map-container">
      <div id="map" className="map"></div>
      <AddPointModal
        isVisible={isModalVisible}
        hideModal={hideModal}
        coordinates={clickCoordinates}
        onSubmit={handleAddPoint}
      />
    </div>
  );
};

export default MapboxComponent;
