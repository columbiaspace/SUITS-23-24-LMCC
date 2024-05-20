import React from 'react';
import { useGlobal } from '../../components/GlobalContext';
import './constant.css'; // Import CSS file for styling

const EVData = ({ evNumber }) => {
  const { allData, error } = useGlobal();

  if (error) return <div>Error: {error}</div>;
  if (!allData.telemetry || !allData.telemetry.telemetry) return <div>Loading...</div>;

  const evaData = allData.telemetry.telemetry[`eva${evNumber}`];

  // List of parameters and values in desired order
  const parameterList = [
    { key: 'batt_time_left', label: 'Battery Time Left' },
    { key: 'oxy_pri_storage', label: 'Oxygen Primary Storage' },
    { key: 'oxy_sec_storage', label: 'Oxygen Secondary Storage' },
    { key: 'oxy_pri_pressure', label: 'Oxygen Primary Pressure' },
    { key: 'oxy_sec_pressure', label: 'Oxygen Secondary Pressure' },
    { key: 'oxy_time_left', label: 'Oxygen Time Left' },
    { key: 'heart_rate', label: 'Heart Rate' },
    { key: 'oxy_consumption', label: 'Oxygen Consumption' },
    { key: 'co2_production', label: 'CO2 Production' },
    { key: 'suit_pressure_oxy', label: 'Suit Pressure O2' },
    { key: 'suit_pressure_co2', label: 'Suit Pressure CO2' },
    { key: 'suit_pressure_other', label: 'Suit Pressure Other' },
    { key: 'suit_pressure_total', label: 'Suit Pressure Total' },
    { key: 'fan_pri_rpm', label: 'Fan Primary RPM' },
    { key: 'fan_sec_rpm', label: 'Fan Secondary RPM' },
    { key: 'helmet_pressure_co2', label: 'Helmet Pressure CO2' },
    { key: 'scrubber_a_co2_storage', label: 'Scrubber A CO2 Storage' },
    { key: 'scrubber_b_co2_storage', label: 'Scrubber B CO2 Storage' },
    { key: 'temperature', label: 'Temperature' },
    { key: 'coolant_ml', label: 'Coolant ml' },
    { key: 'coolant_gas_pressure', label: 'Coolant Gas Pressure' },
    { key: 'coolant_liquid_pressure', label: 'Coolant Liquid Pressure' },
  ];

  // Split the parameter list into two columns
  const midIndex = Math.ceil(parameterList.length / 2);
  const firstColumn = parameterList.slice(0, midIndex);
  const secondColumn = parameterList.slice(midIndex);

  return (
    <div className="ev-container">
      <h2>EV{evNumber} Data</h2>
      <div className="ev-table-container">
        <table className="ev-table">
          <tbody>
            {firstColumn.map((param, index) => (
              <tr key={param.key}>
                <td>{param.label}</td>
                <td>{evaData[param.key]}</td>
                {secondColumn[index] ? (
                  <>
                    <td>{secondColumn[index].label}</td>
                    <td>{evaData[secondColumn[index].key]}</td>
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
