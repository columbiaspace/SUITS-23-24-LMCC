import React from 'react';
import './../pages-style/constant.css';
import LMCCMockup from '../assets/LMCC Mockup.png';
import AstronautGif from '../assets/astronautstream.gif';

function Constant() {
  return (
    <div>
      <div className="container">
        <div className="column Astronaut">
          <div className="header-banner">
            <h2>Astronaut Data</h2>
          </div>
          <div className="gif-container">
            <img src={AstronautGif} alt="Astronaut POV GIF" />
          </div>
          <div className="subContainer">
            <div className="column SuitData">
              <div className="smallHB">
                <h3>Suit Data</h3>
              </div>
            </div>
            <div className="column Biometrics">
              <div className="smallHB">
                <h3>Biometrics</h3>
              </div>
              <p>This section will display the following:</p>
              <ol>
                <li>Astronaut Biometrics</li>
                <li>State of Oxygen and Suit data</li>
                <li>A GIF of the Astronaut's POV</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="column Mission">
          <h3>Mission</h3>
          <p>This section will display the following:</p>
          <ol>
            <li>The Map with checkpoints</li>
            <li>Elapsed Mission Time</li>
            <li>Mission Objective Checklist</li>
          </ol>
          <img className="lmccImg" src={LMCCMockup} alt="LMCCMockup" />
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
