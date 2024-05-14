import React from 'react';
import { useGlobal } from '../../components/GlobalContext';
import './constant2.css'; // Import CSS file for styling

const EVData = ({ evNumber }) => {
  const { allData, error } = useGlobal();

  if (error) return <div>Error: {error}</div>;
  if (!allData.telemetry || !allData.telemetry.telemetry) return <div>Loading...</div>;

  const evaData = allData.telemetry.telemetry[`eva${evNumber}`];

  return (
    <div className="ev-container">
      <h2>EV{evNumber} Data</h2>
      <div className="ev-table-container">
        <table className="ev-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(evaData).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EVData;
