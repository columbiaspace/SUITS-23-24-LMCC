import React from 'react';
import Map from '../../components/Map';
import { useGlobal } from '../../components/GlobalContext';

function Mission() {
  const { allData } = useGlobal();

  // Ensure allData is properly loaded
  if (!allData || !allData.eva || !allData.eva.eva) {
    return (
      <div className="column Mission">
      <div className="header-banner">
        <h2>Mission</h2>
      </div>
      <div className="gif-container">
        <Map />
      </div>
      <div className="timer-container">
        <p>Server is not running</p>
      </div>
    </div>)
  }

  const { eva } = allData.eva; // Destructure for easier access
  const evaStatus = `Started: ${eva.started}, Paused: ${eva.paused}, Completed: ${eva.completed}`;
  const evaTime = eva.total_time;

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
        <p>Mission Timer: {formatTime(evaTime)}</p>
      </div>
      <div className='mission-status'>
        <div className='headings'>
          Task | Status | Timer
        </div>
        <div className='submission-status'>
          EVA: {evaStatus} | Time: {formatTime(evaTime)}
        </div>
      </div>
    </div>
  );
}

export default Mission;
