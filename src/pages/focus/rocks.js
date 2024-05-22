import React, { useEffect, useState } from 'react';
import '../../pages-style/rocks.css';
import Map from "../../components/Map";

function Rocks() {
  const [eva1Data, setEva1Data] = useState(null);
  const [savedRocks, setSavedRocks] = useState(null);
  const [message, setMessage] = useState(null);
  const [pinMessage, setPinMessage] = useState(null);

  const fetchData = async () => {
    try {
      const eva1Response = await fetch('http://localhost:8000/spec_scans', {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!eva1Response.ok) {
        throw new Error(`HTTP error! status: ${eva1Response.status}`);
      }
      const eva1Data = await eva1Response.json();
      setEva1Data(eva1Data.spec.eva1);

      const savedRocksResponse = await fetch('http://localhost:8000/get_spec', {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!savedRocksResponse.ok) {
        throw new Error(`HTTP error! status: ${savedRocksResponse.status}`);
      }
      const savedRocksData = await savedRocksResponse.json();
      setSavedRocks(savedRocksData['saved rocks']);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSaveSpec = async () => {
    try {
      const response = await fetch('http://localhost:8000/save_spec', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error('Error saving spec:', error);
    }
  };

  const handleDropPin = async () => {
    try {
      const response = await fetch('http://localhost:8000/drop_pin_here/1', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setPinMessage(result.message);
    } catch (error) {
      console.error('Error dropping pin:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="rocks-container">
      <div id="left-section">
        <div className="top-div">
          <div className="map-container">
            <Map zoom={18} />
          </div>
        </div>
        <div className="bottom-div">
          {savedRocks ? (
            <pre>{JSON.stringify(savedRocks, null, 2)}</pre>
          ) : (
            'Loading...'
          )}
        </div>
      </div>
      <div id="right-section">
        <div className="data-container">
          <div className="ev1-data">
            {eva1Data ? (
              <pre>{JSON.stringify(eva1Data, null, 2)}</pre>
            ) : (
              'Loading...'
            )}
          </div>
          <div className="significant-info">
            <h3>Samples are considered scientifically significant if:</h3>
            <ul>
              <li>SiO2 &lt; 10%</li>
              <li>TiO2 &gt; 1%</li>
              <li>Al2O3 &gt; 10%</li>
              <li>FeO-T &gt; 29%</li>
              <li>MnO &gt; 1%</li>
              <li>MgO &gt; 20%</li>
              <li>CaO &gt; 10%</li>
              <li>K2O &gt; 1%</li>
              <li>P2O5 &gt; 1.5%</li>
              <li>other &gt; 50%</li>
            </ul>
          </div>
        </div>
        <div className="button-container">
          <button id="save-button" onClick={handleSaveSpec}>Save Spec</button>
          <button id="drop-pin-button" onClick={handleDropPin}>Drop Pin Here</button>
        </div>
        {message && <p>{message}</p>}
        {pinMessage && <p>{pinMessage}</p>}
      </div>
    </div>
  );
}

export default Rocks;
