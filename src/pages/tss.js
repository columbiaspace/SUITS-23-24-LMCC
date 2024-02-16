import React from 'react';
import './../pages-style/tss.css';

function Tss() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
  };

  return (
    <div style={containerStyle}>
      <h1>TSS</h1>
      <p>DE Procedure</p>
      <ol>
        <li>Use hand menu to navigate to TSS Scene.</li>
        <li>Click into and type IP address into the input field.</li>
        <li>Click Connect button.</li>
      </ol>
      <p>This page should give detailed instructions on how to connect to the TSS and also confirm that the DE has connected properly.</p>
    </div>
  );
}

export default Tss;
