import React, { useState, useEffect } from 'react';
import Map from '../../components/Map.js';

function Mission() {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let time = 0;
    const fetchTime = async () => {
      try {
        const response = await fetch('http://localhost:8000/json_data/teams/0/EVA.json');
        const data = await response.json();
        time = data.eva.total_time;
        setTimer(time);
      } catch (error) {
        console.error("Failed to fetch time data:", error);
      }
    };

    fetchTime();
    const interval = setInterval(fetchTime, 500);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  return (
    <div className="column Mission">
      <div className="header-banner">
            <h2>Mission</h2>
          </div>
          <div className="gif-container">
            <Map />
          </div>
          <div className="timer-container">
          <p>Mission Timer: {formatTime(timer)}</p>
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

export default Mission;