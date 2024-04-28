import React from 'react';
import Map from '../../components/Map.js';

function mission() {
  return (
    <div className="column Mission">
      <div className="header-banner">
            <h2>Mission</h2>
          </div>
          <div className="gif-container">
            <Map />
          </div>
          <div className="timer-container">
            <p>Mission Timer: 0:00:00</p>
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
  );
}

export default mission;