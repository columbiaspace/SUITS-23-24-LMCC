import React from 'react';
import './../pages-style/constant.css';
import LMCCMockup from '../assets/LMCC Mockup.png';

function Constant() {
  return (
    <div>
      <div className="container">
        <div className="column Astronaut">
          <h3>Astronaut</h3>
          <p>This section will display the following:</p>
          <ol>
            <li>Astronaut Biometrics</li>
            <li>State of Oxygen and Suit data</li>
            <li>A video feed of the Astronauts POV</li>
          </ol>
        </div>
        <div className="column Mission">
          <h3>Mission</h3>
          <p>This section will display the following:</p>
          <ol>
            <li>The Map with checkpoints</li>
            <li>Elapsed Mission Time</li>
            <li>Mission Objective Checklist</li>
          </ol>
          <img src={LMCCMockup} alt="LMCCMockup" />
        </div>
        <div className="column Rover">
          <h3>Rover</h3>
          <p>This section will display the following:</p>
          <ol>
            <li>Rover Camera Feed</li>
            <li>State of Rover battery, connection, tire pressure</li>
            <li>Rover Thermal Camera Feed</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Constant;
