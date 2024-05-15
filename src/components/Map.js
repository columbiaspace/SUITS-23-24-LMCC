import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxComponent = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [showMarkers, setShowMarkers] = useState(true);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
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

    newMap.on("load", () => {
      setMap(newMap);
    });

    newMap.on("mousemove", (e) => {
      setCoordinates({
        lat: e.lngLat.lat.toFixed(4),
        lng: e.lngLat.lng.toFixed(4),
      });
    });

    return () => {
      markers.forEach((marker) => marker.marker.remove());
      newMap.remove();
    };
  }, [mapBoxAPIKey, markers]);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch("http://localhost:8000/geojson");
        const geoJson = await response.json();

        if (map) {
          if (map.getSource("geojson-source")) {
            map.getSource("geojson-source").setData(geoJson);
          } else {
            map.addSource("geojson-source", {
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

              map.addLayer({
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
          }
        }
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    const intervalId = setInterval(fetchGeoJson, 1000);

    return () => clearInterval(intervalId);
  }, [map]);

  const addMarker = async (title, description, lat, lng) => {
    try {
      await fetch("http://localhost:8000/add_marker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, lat, lng }),
      });
    } catch (error) {
      console.error("Error posting new marker:", error);
    }
  };

  useEffect(() => {
    if (!map) return;

    map.on("click", (e) => {
      const title = prompt("Enter title for the marker:");
      const description = prompt("Enter description for the marker:");
      if (!title || !description) return;

      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;

      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${title}</h3><p>${description}</p>`
          )
        )
        .addTo(map);

      setMarkers((currentMarkers) => [
        ...currentMarkers,
        { marker, title, description, id: currentMarkers.length },
      ]);

      addMarker(title, description, lat, lng);
    });
  }, [map]);

  const toggleVisibility = () => {
    setShowMarkers(!showMarkers);
    markers.forEach(
      (m) =>
        (m.marker.getElement().style.display = showMarkers ? "none" : "block")
    );
  };

  const handleSelectPoint = (marker) => {
    const updatedSelection = selectedPoints.includes(marker)
      ? selectedPoints.filter((p) => p !== marker)
      : [...selectedPoints, marker];
    setSelectedPoints(
      updatedSelection.length > 2 ? updatedSelection.slice(1) : updatedSelection
    );
  };

  const displayMarkerInfo = (marker) => {
    alert(`Title: ${marker.title}\nDescription: ${marker.description}`);
  };

  const calculateRoute = () => {
    if (selectedPoints.length === 2) {
      const [start, end] = selectedPoints.map((m) => m.marker.getLngLat());
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
    } else {
      alert("Please select exactly two markers to draw a route.");
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
      <div id="map" style={{ flex: 1, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            margin: "10px",
            padding: "5px 10px",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            zIndex: 1,
            fontSize: "12px",
          }}
        >
          {`Lat: ${coordinates.lat}, Lng: ${coordinates.lng}`}
        </div>
      </div>
      <div style={{ width: "250px", overflowY: "auto" }}>
        <label>
          <input
            type="checkbox"
            checked={!showMarkers}
            onChange={toggleVisibility}
          />
          {showMarkers ? "Hide Markers" : "Show Markers"}
        </label>
        <label>
          <input type="checkbox" onChange={calculateRoute} />
          Calculate Route
        </label>
        <label>
          <input type="checkbox" onChange={cancelRoute} />
          Cancel Route
        </label>
        {markers.map((marker, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              backgroundColor: selectedPoints.includes(marker)
                ? "lightblue"
                : "white",
              cursor: "pointer",
            }}
            onClick={() => handleSelectPoint(marker)}
            onDoubleClick={() => displayMarkerInfo(marker)}
          >
            {marker.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapboxComponent;
