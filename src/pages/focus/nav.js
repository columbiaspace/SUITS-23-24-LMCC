import React, { useState, useEffect, useRef } from "react";
import "../../pages-style/page.css";
import "../../pages-style/nav.css";
import Map from "../../components/Map";

function Nav() {
  const [points, setPoints] = useState([]);
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:8000/get_geojson')
      .then(response => response.json())
      .then(data => {
        const validPoints = data.features.filter(point =>
          point.geometry.type === 'Point' && point.properties.Name
        );
        setPoints(validPoints);
      })
      .catch(error => console.error('Error fetching points:', error));
  }, []);

  useEffect(() => {
    if (startId && endId) {
      calculateShortestPath(startId, endId);
      intervalRef.current = setInterval(() => {
        calculateShortestPath(startId, endId);
      }, 3000);

      return () => clearInterval(intervalRef.current);
    }
  }, [startId, endId]);

  const calculateShortestPath = (startId, endId) => {
    const data = {
      start_id: startId,
      end_id: endId
    };

    fetch('http://localhost:8000/get_shortest_path', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        const distance = data.distance;
        if (distance < 10) {
          clearInterval(intervalRef.current);
        }
        console.log('Distance:', distance);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (startId && endId) {
      clearInterval(intervalRef.current);
      calculateShortestPath(startId, endId);
    }
  };

  return (
    <div id="navPage" className="pagecontainer">
      <h1>Navigation</h1>
      <div id="conti">
        <div className="map-container" id="navMap">
          <Map zoom={19} />
        </div>
        <div id="navControls">
          <form onSubmit={handleFormSubmit}>
            <div>
              <h3>Select Start Point</h3>
              <select
                value={startId}
                onChange={(e) => setStartId(parseInt(e.target.value, 10))}
                required
              >
                <option value="" disabled>Select start point</option>
                {points.map(point => (
                  <option key={point.id} value={point.id}>
                    {point.properties.Name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3>Select End Point</h3>
              <select
                value={endId}
                onChange={(e) => setEndId(parseInt(e.target.value, 10))}
                required
              >
                <option value="" disabled>Select end point</option>
                {points.map(point => (
                  <option key={point.id} value={point.id}>
                    {point.properties.Name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default Nav;
