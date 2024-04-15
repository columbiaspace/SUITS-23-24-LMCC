import React, { useState, useEffect } from 'react';
import StreamComponent from '../components/StreamComponent.js';
import Map from '../components/Map.js';
import { getTSS_IP } from './../helpers/ipAddress.js'; // Import getTSS_IP function
import { downloadAndReplaceFile, } from './../helpers/wgetHelper.js';
import "./../pages-style/constant.css";
import RoverCam from "../components/RoverCamera.js";

function Constant() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    const TSS_IP = getTSS_IP();
    const targetDirectory = '/src/assets/json_data/teams/0';
    const fileName = '/json_data/teams/0/TELEMETRY.json'; 

    if (TSS_IP !== "None") {
      downloadAndReplaceFile(TSS_IP, fileName, targetDirectory);
    } else {
      console.error("TSS_IP is not set.");
    }

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsRunning(false);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <div>
      <div className="container">
        {/* Column 1: Astronaut */}
        <div className="column Astronaut">
          <div className="header-banner">
            <h2>Astronaut:</h2>
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
                <span>45</span>
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

        {/* Column 2: Mission */}
        <div className="column Mission">
          <div className="header-banner">
            <h2>Mission</h2>
          </div>
          <div className="gif-container">
            <Map />
          </div>
          <div className="timer-container">
            <p>Mission Timer: {formatTime(timer)}</p>
            <button onClick={startTimer}>Start</button>
            <button onClick={stopTimer}>Stop</button>
            <button onClick={resetTimer}>Reset</button>
          </div>
          <div className="taskBox">
            <div className="twoTasks">
              <div className="taskContainer" style={{ background: "green" }}>
                <span>Egress:&nbsp;</span>
                <span>Completed</span>
              </div>
              <div className="taskContainer" style={{ background: "red" }}>
                <span>Rock Scanning:&nbsp;</span>
                <span>Not Started</span>
              </div>
            </div>
            <div className="twoTasks">
              <div className="taskContainer" style={{ background: "green" }}>
                <span>Navigation:&nbsp;</span>
                <span>Completed</span>
              </div>
              <div className="taskContainer" style={{ background: "red" }}>
                <span>Rover:&nbsp;</span>
                <span>Not Started</span>
              </div>
            </div>
            <div className="twoTasks">
              <div className="taskContainer" style={{ background: "yellow" }}>
                <span>Equipment:&nbsp;</span>
                <span>In Progress</span>
              </div>
              <div className="taskContainer" style={{ background: "red" }}>
                <span>Ingress:&nbsp;</span>
                <span>Not Started</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Rover */}
        <div className="column Rover">
          <div className="header-banner">
            <h2>Rover</h2>
          </div>
          <div
            className="gif-container"
            style={{ height: "50%", display: "flex", alignItems: "stretch" }}
          >
            <RoverCam />
          </div>
          <div
            className="gif-container"
            style={{ height: "50%", display: "flex", alignItems: "stretch" }}
          >
            <RoverCam />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Constant;
