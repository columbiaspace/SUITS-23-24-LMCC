import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxComponent = () => {
  const [mapBoxAPIKey, setMapBoxAPIKey] = useState(null);

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

        // Add point layer
        newMap.addLayer({
          id: "points",
          type: "circle",
          source: "geojson-source",
          filter: ["==", "$type", "Point"],
          paint: {
            "circle-color": "#FF0000", // Red color for points
            "circle-radius": 3,
          },
        });

        // Add line layer
        newMap.addLayer({
          id: "lines",
          type: "line",
          source: "geojson-source",
          filter: ["==", "$type", "LineString"],
          paint: {
            "line-color": "#0000FF", // Blue color for lines
            "line-width": 2,
          },
        });

        // Add fill layer for polygons
        newMap.addLayer({
          id: "polygons",
          type: "fill",
          source: "geojson-source",
          filter: ["==", "$type", "Polygon"],
          paint: {
            "fill-opacity": 0,
          },
        });

        // Add border layer for polygons
        newMap.addLayer({
          id: "polygon-borders",
          type: "line",
          source: "geojson-source",
          filter: ["==", "$type", "Polygon"],
          paint: {
            "line-color": "#000000", // Black color for polygon borders
            "line-width": 1,
          },
        });

        const fetchGeoJSON = async () => {
          try {
            const response = await fetch("http://localhost:8000/get_geojson");
            const geojsonData = await response.json();

            // Print all features in the GeoJSON
            console.log("GeoJSON Features:", geojsonData.features);

            // Update the source data
            newMap.getSource("geojson-source").setData(geojsonData);
          } catch (error) {
            console.error("Error fetching geoJSON data:", error);
          }
        };

        // Initial fetch
        fetchGeoJSON();

        // Set interval to fetch data every 3 seconds
        const intervalId = setInterval(fetchGeoJSON, 3000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      });
    }
  }, [mapBoxAPIKey]);

  return <div id="map" style={{ width: "100%", height: "100vh" }} />;
};

export default MapboxComponent;
