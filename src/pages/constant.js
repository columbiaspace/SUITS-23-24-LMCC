import React from 'react';
import './../pages-style/constant.css';
import AstronautGif from '../assets/astronautstream.gif';
import RoverGif from '../assets/RoverGif.gif';
import ThermalGif from '../assets/ThermalGif.gif';
import MapGif from '../assets/MapGif.gif';
function Constant() {
  return (
    <div>
      <div className="container">
        {/* Column 1: Astronaut */}
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
              <div className="data">
                <span>Oxygen Tank Level:&nbsp;</span>
                <span>45</span>
                <span>%</span>
              </div>
              <div className="data">
                <span>Air Seal:&nbsp;</span>
                <span>Good</span>
              </div>
              <div className="data">
                <span>Electronic Connections:&nbsp;</span>
                <span>Good</span>
              </div>
              <div className="data">
                <span>Network Connection:&nbsp;</span>
                <span>Poor</span>
              </div>
              <div className="data">
                <span>Fan Speed:&nbsp;</span>
                <span>Good</span>
              </div>
              <div className="data">
                <span>Water Level:&nbsp;</span>
                <span>Mid</span>
              </div>
            </div>
            <div className="column Biometrics">
              <div className="smallHB">
                <h3>Biometrics</h3>
              </div>
              <div className="data">
                <span>Blood Oxygen:&nbsp;</span>
                <span>98</span>
                <span>%</span>
              </div>
              <div className="data">
                <span>Heartrate:&nbsp;</span>
                <span>120</span>
                <span>bpm</span>
              </div>
              <div className="data">
                <span>Respiratory Rate:&nbsp;</span>
                <span>17</span>
                <span>bpm</span>
              </div>
              <div className="data">
                <span>Body Temp:&nbsp;</span>
                <span>98.9</span>
                <span>*F</span>
              </div>
              <div className="data">
                <span>Blood Pressure:&nbsp;</span>
                <span>140/90</span>
                <span>mmHg</span>
              </div>
              <div className="data">
                <span>Stress Level:&nbsp;</span>
                <span>HIGH!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Mission */}
        <div className="column Mission">
          <div className="header-banner">
            <h2>Mission</h2>
          </div>
          <div className="gif-container">
            <h2 className="map-title">Map</h2>
            <img src={MapGif} alt="Map GIF" />
          </div>
        </div>

        {/* Column 3: Rover */}
        <div className="column Rover">
          <div className="header-banner">
            <h2>Rover</h2>
          </div>
          <div className="gif-container">
            <img src={RoverGif} alt="Rover POV GIF" />
          </div>
          <div className="gif-container">
            <img src={ThermalGif} alt="Rover Thermal POV GIF" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Constant;
