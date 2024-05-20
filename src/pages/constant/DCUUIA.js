import React, { useState, useEffect } from 'react';
import "./constant.css";
import "./dcuuia.css";

const DCUUIA = () => {
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8000/dcu_uia')
        .then(response => response.json())
        .then(data => {
          setData(data);
          setHasError(false);
        })
        .catch(error => {
          console.error('Error fetching DCU/UIA data:', error);
          setHasError(true);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Adjust the interval as needed
    return () => clearInterval(interval);
  }, []);

  if (hasError) {
    return <div>Error fetching DCU/UIA data</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const renderStatus = (status) => (
    <span id={status ? 'status-indicator-green' : 'status-indicator-red'}>
      {status ? 'Online' : 'Offline'}
    </span>
  );

  return (
    <div id="dcu-uia-container">
      <div id="status-section">
        <h3>DCU Status</h3>
        <div id="status-grid">
          <div id="status-item">EVA1 Battery: {renderStatus(data.dcu.eva1.batt)}</div>
          <div id="status-item">EVA1 Oxygen: {renderStatus(data.dcu.eva1.oxy)}</div>
          <div id="status-item">EVA1 Comm: {renderStatus(data.dcu.eva1.comm)}</div>
          <div id="status-item">EVA1 Fan: {renderStatus(data.dcu.eva1.fan)}</div>
          <div id="status-item">EVA1 Pump: {renderStatus(data.dcu.eva1.pump)}</div>
          <div id="status-item">EVA1 CO2: {renderStatus(data.dcu.eva1.co2)}</div>
          <div id="status-item">EVA2 Battery: {renderStatus(data.dcu.eva2.batt)}</div>
          <div id="status-item">EVA2 Oxygen: {renderStatus(data.dcu.eva2.oxy)}</div>
          <div id="status-item">EVA2 Comm: {renderStatus(data.dcu.eva2.comm)}</div>
          <div id="status-item">EVA2 Fan: {renderStatus(data.dcu.eva2.fan)}</div>
          <div id="status-item">EVA2 Pump: {renderStatus(data.dcu.eva2.pump)}</div>
          <div id="status-item">EVA2 CO2: {renderStatus(data.dcu.eva2.co2)}</div>
        </div>
      </div>
      <div id="status-section">
        <h3>UIA Status</h3>
        <div id="status-grid">
          <div id="status-item">EVA1 Power: {renderStatus(data.uia.eva1_power)}</div>
          <div id="status-item">EVA1 Oxygen: {renderStatus(data.uia.eva1_oxy)}</div>
          <div id="status-item">EVA1 Water Supply: {renderStatus(data.uia.eva1_water_supply)}</div>
          <div id="status-item">EVA1 Water Waste: {renderStatus(data.uia.eva1_water_waste)}</div>
          <div id="status-item">EVA2 Power: {renderStatus(data.uia.eva2_power)}</div>
          <div id="status-item">EVA2 Oxygen: {renderStatus(data.uia.eva2_oxy)}</div>
          <div id="status-item">EVA2 Water Supply: {renderStatus(data.uia.eva2_water_supply)}</div>
          <div id="status-item">EVA2 Water Waste: {renderStatus(data.uia.eva2_water_waste)}</div>
          <div id="status-item">Oxygen Vent: {renderStatus(data.uia.oxy_vent)}</div>
          <div id="status-item">Depress: {renderStatus(data.uia.depress)}</div>
        </div>
      </div>
    </div>
  );
};

export default DCUUIA;
