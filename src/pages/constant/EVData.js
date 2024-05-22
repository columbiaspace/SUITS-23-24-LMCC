import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../components/GlobalContext';
import './constant.css'; // Import CSS file for styling

const EVData = ({ evNumber }) => {
  const { error } = useGlobal();
  const [allData, setAllData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_telemetry_data');
        const data = await response.json();
        setAllData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // Fetch data every second
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!allData || !allData.telemetry || !allData.telemetry.telemetry) return <div>Loading...</div>;

  const evaData = allData.telemetry.telemetry[`eva${evNumber}`];

  // List of parameters and values in desired order
  const parameterList = [
    { key: 'batt_time_left', label: 'Battery Time Left', min: 3600, max: 10800 },
    { key: 'oxy_pri_storage', label: 'Oxygen Primary Storage', min: 20, max: 100 },
    { key: 'oxy_sec_storage', label: 'Oxygen Secondary Storage', min: 20, max: 100 },
    { key: 'oxy_pri_pressure', label: 'Oxygen Primary Pressure', min: 600, max: 3000 },
    { key: 'oxy_sec_pressure', label: 'Oxygen Secondary Pressure', min: 600, max: 3000 },
    { key: 'oxy_time_left', label: 'Oxygen Time Left', min: 3600, max: 21600 },
    { key: 'coolant_ml', label: 'Coolant Storage', min: 80, max: 100 }, // Updated
    { key: 'heart_rate', label: 'Heart Rate', min: 50, max: 160 },
    { key: 'oxy_consumption', label: 'Oxygen Consumption', min: 0.05, max: 0.15 },
    { key: 'co2_production', label: 'CO2 Production', min: 0.05, max: 0.15 },
    { key: 'suit_pressure_oxy', label: 'Suit Pressure O2', min: 3.5, max: 4.1 },
    { key: 'suit_pressure_co2', label: 'Suit Pressure CO2', min: 0.0, max: 0.1 }, // Key to check for alternate naming
    { key: 'suit_pressure_other', label: 'Suit Pressure Other', min: 0.0, max: 0.5 },
    { key: 'suit_pressure_total', label: 'Suit Pressure Total', min: 3.5, max: 4.5 },
    { key: 'fan_pri_rpm', label: 'Fan Primary RPM', min: 20000, max: 30000 },
    { key: 'fan_sec_rpm', label: 'Fan Secondary RPM', min: 20000, max: 30000 },
    { key: 'helmet_pressure_co2', label: 'Helmet Pressure CO2', min: 0.0, max: 0.15 },
    { key: 'scrubber_a_co2_storage', label: 'Scrubber A CO2 Storage', min: 0.0, max: 60 },
    { key: 'scrubber_b_co2_storage', label: 'Scrubber B CO2 Storage', min: 0.0, max: 60 },
    { key: 'temperature', label: 'Temperature', min: 50, max: 90 },
    { key: 'coolant_liquid_pressure', label: 'Coolant Liquid Pressure', min: 100, max: 700 },
    { key: 'coolant_gas_pressure', label: 'Coolant Gas Pressure', min: 0, max: 700 },
  ];

  // Function to determine the background color based on the value range
  const getBackgroundColor = (value, min, max) => {
    if (value < min || value > max) {
      return 'red';
    }
    return 'green';
  };

  // Function to format the value to a fixed number of decimal places
  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2); // Change the number of decimal places if needed
    }
    return value;
  };

  // Split the parameter list into two columns
  const midIndex = Math.ceil(parameterList.length / 2);
  const firstColumn = parameterList.slice(0, midIndex);
  const secondColumn = parameterList.slice(midIndex);

  return (
    <div className="ev-container">
      <h4>EV{evNumber} Data</h4>
      <div className="ev-table-container">
        <table className="ev-table">
          <tbody>
            {firstColumn.map((param, index) => (
              <tr key={param.key}>
                <td>{param.label}</td>
                <td
                  style={{
                    backgroundColor: getBackgroundColor(evaData[param.key] ?? evaData[`suit_pressure_cO2`], param.min, param.max),
                    color: 'black',
                  }}
                >
                  {formatValue(evaData[param.key] ?? evaData[`suit_pressure_cO2`])}
                </td>
                {secondColumn[index] ? (
                  <>
                    <td>{secondColumn[index].label}</td>
                    <td
                      style={{
                        backgroundColor: getBackgroundColor(evaData[secondColumn[index].key] ?? evaData[`suit_pressure_cO2`], secondColumn[index].min, secondColumn[index].max),
                        color: 'black',
                      }}
                    >
                      {formatValue(evaData[secondColumn[index].key] ?? evaData[`suit_pressure_cO2`])}
                    </td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EVData;
