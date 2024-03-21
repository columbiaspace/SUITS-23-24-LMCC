import React, { useState } from 'react';
import './../pages-style/tss.css';
function Tss() {
  const [ipAddress, setIpAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isValidIp, setIsValidIp] = useState(null);
  const ipRegex = /^(?!0)(?!.*\.$)((1?\d\d?|2[0-4]\d|25[0-5])\.){3}(1?\d\d?|2[0-4]\d|25[0-5])$/;
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row', // ensures horizontal layout
    alignItems: 'flex-start', // aligns items to the top of the container
    height: '100vh',
    textAlign: 'center',
  };
  const columnStyle = {
    width: '33.33%',
    padding: '10px', // added padding for spacing inside the columns
    //background: '#F2F2F2', // light grey background for each column
    boxSizing: 'border-box', // ensures padding doesn't affect width
  };
  const handleInputChange = (e) => {
    const newIpAddress = e.target.value;
    setIpAddress(newIpAddress);
    setIsValidIp(ipRegex.test(newIpAddress));
    console.log(`User entered IP address: ${newIpAddress}`);
  };
  const handleConnect = () => {
    if (isValidIp) {
      console.log(`Attempting to connect to TSS at IP: ${ipAddress}`);
      setIsConnected(true); // Simulate a successful connection
    } else {
      console.log('Invalid IP address. Please enter a valid IP address to connect.');
      setIsConnected(false);
    }
  };
  return (
    <div style={containerStyle}>
      <div style={columnStyle}>
        <h2>Status</h2>
        {isValidIp !== null && (
          isValidIp ? <span style={{ color: 'green' }}>:heavy_check_mark:</span> : <span style={{ color: 'red' }}>:heavy_multiplication_x:</span>
        )}
      </div>
      <div style={columnStyle}>
        <h2>Enter IP Address</h2>
        <input
          type="text"
          value={ipAddress}
          onChange={handleInputChange}
          placeholder="Enter IP address"
        />
        <button onClick={handleConnect} disabled={isValidIp === false}>Connect</button>
      </div>
      <div style={columnStyle}>
        <h2>Connection Details</h2>
        <p>DE Procedure</p>
        <ol>
          <li>Use hand menu to navigate to TSS Scene.</li>
          <li>Type the IP address into the input field below.</li>
          <li>Click the Connect button to establish a connection.</li>
        </ol>
        {isConnected && <p style={{ color: 'green' }}>Connected to TSS successfully!</p>}
        {!isConnected && isValidIp && <p>Connecting...</p>}
        <p>This page should give detailed instructions on how to connect to the TSS and also confirm that the DE has connected properly.</p>
      </div>
    </div>
  );
}
export default Tss;