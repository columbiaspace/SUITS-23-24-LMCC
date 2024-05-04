import React from "react";
import StreamComponent from "../../components/StreamComponent.js";

function astronaut() {


  // useEffect(() => {
  //   let time = 0;

  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/json_data/teams/0/EVA.json');
  //       const data = await response.json();
  //       time = data.eva.total_time;
  //       setTimer(time);
  //     } catch (error) {
  //       console.error("Failed to fetch time data:", error);
  //     }
  //   };

  //   fetchData();
  //   const interval = setInterval(fetchTime, 1000); // Update every 1 second
  //   return () => clearInterval(interval);
  // }, []);

  let oxygen_level = 45

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
            <span>{oxygen_level}</span>
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
            <span>120</span>
            <span>bpm</span>
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

export default astronaut;
