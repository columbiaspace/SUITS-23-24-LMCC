import React from "react";
import './bottombuttons.css';

const BottomButtons = () => {
    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'center', // Center the buttons horizontally
        gap: '10px', // Adjust the gap as needed
    };

    const handleButtonClick = (url) => {
        window.location.href = url;  // Use window.location.href to navigate to the specified URL
    };

    return (
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
    );
};

export default BottomButtons;
