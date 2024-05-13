import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";
import geoJson from "../assets/json_data/GeoJson/stagnentData.json";

const MapboxComponent = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [mapBoxAPIKey, setMapBoxAPIKey] = useState(null);

  useEffect(() => {
    const fetchMapBoxAPIKey = async () => {
      try {
        const response = await fetch("http://localhost:8000/get_mapbox_key");
        const data = await response.json();
        setMapBoxAPIKey(data.MAPBOX_KEY);
      } catch (error) {
        console.error("Error fetching MapBox API key:", error);
      }
    };

    fetchMapBoxAPIKey();
  }, []);

  useEffect(() => {
    if (!mapBoxAPIKey) return;

    mapboxgl.accessToken = mapBoxAPIKey;
    const newMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-95.08148549138448, 29.564911887991144],
      zoom: 15,
    });
    setMap(newMap);

    newMap.on("load", function () {
      newMap.addSource("geojson-source", {
        type: "geojson",
        data: geoJson,
      });

      geoJson.features.forEach((feature, index) => {
        if (feature.properties.mapbounds) return;

        const layerId = `${feature.geometry.type.toLowerCase()}-layer-${index}`;
        const layerType =
          feature.geometry.type === "Point"
            ? "circle"
            : feature.geometry.type === "LineString"
            ? "line"
            : "fill";

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

    return () => {
      if (markers) {
        markers.forEach((marker) => marker.marker.remove());
      }
      newMap.remove();
    };
  }, [mapBoxAPIKey, markers]);

  useEffect(() => {
    if (!map) return;
    map.on("click", (e) => {
      const title = prompt("Enter title for the marker:");
      const description = prompt("Enter description for the marker:");
      if (!title || !description) return;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>${title}</h3><p>${description}</p>`
      );

      const marker = new mapboxgl.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .setPopup(popup)
        .addTo(map);

      setMarkers((currentMarkers) => [
        ...currentMarkers,
        { marker, title, description, id: currentMarkers.length },
      ]);
    });
  }, [map]);

  const handleSelectPoint = (id) => {
    if (selectedPoints.includes(id)) {
      setSelectedPoints(selectedPoints.filter((point) => point !== id));
    } else if (selectedPoints.length < 2) {
      setSelectedPoints([...selectedPoints, id]);
    }
  };

  const displayMarkerInfo = (marker) => {
    const { title, description } = marker;
    alert(`Title: ${title}\nDescription: ${description}`);
  };

  const calculateRoute = () => {
    if (selectedPoints.length < 2) return;

    const start = markers
      .find((marker) => marker.id === selectedPoints[0])
      .marker.getLngLat();
    const end = markers
      .find((marker) => marker.id === selectedPoints[1])
      .marker.getLngLat();

    const route = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat],
        ],
      },
    };

    if (map.getSource("route")) {
      map.getSource("route").setData(route);
    } else {
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: route,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff7e5f",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }
  };

  const cancelRoute = () => {
    if (map.getLayer("route")) {
      map.removeLayer("route");
      map.removeSource("route");
    }
    setSelectedPoints([]);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div id="map" style={{ flex: 1 }}></div>
      <div style={{ width: "250px", overflowY: "auto" }}>
        {markers.map((marker, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              backgroundColor: selectedPoints.includes(marker.id)
                ? "lightblue"
                : "white",
              cursor: "pointer",
            }}
            onClick={() => handleSelectPoint(marker.id)}
            onDoubleClick={() => displayMarkerInfo(marker)}
          >
            {marker.title}
          </div>
        ))}
        <button
          onClick={calculateRoute}
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        >
          Calculate Route
        </button>
        <button
          onClick={cancelRoute}
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        >
          Cancel Route
        </button>
      </div>
    </div>
  );
};

export default MapboxComponent;
