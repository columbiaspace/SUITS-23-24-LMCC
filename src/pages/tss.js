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

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px', // Adjust the gap as needed
  };

  const handleButtonClick = (url) => {
    window.location.href = url;  // Use window.location.href to navigate to the specified URL
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
      
      <div style={buttonContainerStyle}>
        {/* Button for '/Constant' */}
        <button onClick={() => handleButtonClick('/Constant')} style={{ cursor: 'pointer' }}>
          {/* You can use a different icon or triangle symbol here */}
          &#9664; Constant
        </button>

        {/* Button for '/Rover' */}
        <button onClick={() => handleButtonClick('/Rover')} style={{ cursor: 'pointer' }}>
          {/* You can use an icon or triangle symbol here */}
          &#9654; Rover
        </button>
      </div>
    </div>
  );
}

export default Tss;
