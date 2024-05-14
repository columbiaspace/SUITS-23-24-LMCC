import React from "react";
import StreamComponent from "../../components/StreamComponent.js";
import { useGlobal } from '../../components/GlobalContext';

function Astronaut() {
  const { allData } = useGlobal();
  const heartRate = allData?.telemetry?.telemetry?.eva1?.heart_rate;

  return (
    <div className="column Astronaut">
      <div className="header-banner">
        <h2>Astronaut</h2>
      </div>
      <div className="gif-container">
        <StreamComponent />
      </div>
      <div className="subContainer">
        <div className="columnSuitBiometrics">
          <div className="smallHB">
            <h3>Suit Data</h3>
          </div>
          <div className="data" style={{ background: "yellow" }}>
            <span>Oxygen Tank Level:&nbsp;</span>
            <span>20</span>
            <span>%</span>
          </div>
          <div className="data" style={{ background: "green" }}>
            <span>Air Seal:&nbsp;</span>
            <span>Good</span>
          </div>
          <div className="data" style={{ background: "green" }}>
            <span>Electronic Connections:&nbsp;</span>
            <span>Good</span>
          </div>
          <div className="data" style={{ background: "red" }}>
            <span>Network Connection:&nbsp;</span>
            <span>Poor</span>
          </div>
          <div className="data" style={{ background: "green" }}>
            <span>Fan Speed:&nbsp;</span>
            <span>Good</span>
          </div>
          <div className="data" style={{ background: "yellow" }}>
            <span>Water Level:&nbsp;</span>
            <span>Mid</span>
          </div>
        </div>
        <div className="columnSuitBiometrics">
          <div className="smallHB">
            <h3>Biometrics</h3>
          </div>
          <div className="data" style={{ background: "green" }}>
            <span>Blood Oxygen:&nbsp;</span>
            <span>98</span>
            <span>%</span>
          </div>
          <div className="data" style={{ background: "yellow" }}>
            <span>Heartrate:&nbsp;</span>
            <span>{heartRate} bpm</span>
          </div>
          <div className="data" style={{ background: "green" }}>
            <span>Respiratory Rate:&nbsp;</span>
            <span>17</span>
            <span>bpm</span>
          </div>
          <div className="data" style={{ background: "green" }}>
            <span>Body Temp:&nbsp;</span>
            <span>98.9</span>
            <span>*F</span>
          </div>
          <div className="data" style={{ background: "red" }}>
            <span>Blood Pressure:&nbsp;</span>
            <span>140/90</span>
            <span>mmHg</span>
          </div>
          <div className="data" style={{ background: "red" }}>
            <span>Stress Level:&nbsp;</span>
            <span>HIGH!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Astronaut;
