import React, { useState, useEffect } from 'react';

function TelemetryData() {
  const [telemetry, setTelemetry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.207.65.3:14141/json_data/teams/0/TELEMETRY.json', {
            method: 'GET',
            mode: 'no-cors'
          });
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response)
        // Note: In no-cors mode, response.json() will always return null
        setTelemetry(response.statusText); // Just for demonstration, you may use response.statusText or whatever suits your needs
      } catch (error) {
        setError(error);
        console.log(error)

      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!telemetry) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Telemetry Data</h2>
      <p>{telemetry}</p>
    </div>
  );
}

export default TelemetryData;
