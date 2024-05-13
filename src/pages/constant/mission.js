
import Map from '../../components/Map.js';
import { useGlobal } from '../../components/GlobalContext';

function Mission() {
  const { evaData } = useGlobal();
  const timer = evaData.total_time || 0; // Default to 0 if total_time is undefined

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
          <div className="taskContainer" style={{
            background: evaData.uia.completed ? "green" : (evaData.uia.started ? "yellow" : "red")
          }}>
            <span>UIA:&nbsp;</span>
            <span>{evaData.uia.completed ? "Completed" : (evaData.uia.started ? "In Progress" : "Not Started")}</span>
          </div>
          <div className="taskContainer" style={{
            background: evaData.spec.completed ? "green" : (evaData.spec.started ? "yellow" : "red")
          }}>
            <span>Spectroscopy:&nbsp;</span>
            <span>{evaData.spec.completed ? "Completed" : (evaData.spec.started ? "In Progress" : "Not Started")}</span>
          </div>
        </div>
        <div className="twoTasks">
          <div className="taskContainer" style={{
            background: evaData.dcu.completed ? "green" : (evaData.dcu.started ? "yellow" : "red")
          }}>
            <span>DCU:&nbsp;</span>
            <span>{evaData.dcu.completed ? "Completed" : (evaData.dcu.started ? "In Progress" : "Not Started")}</span>
          </div>
          <div className="taskContainer" style={{
            background: evaData.rover.completed ? "green" : (evaData.rover.started ? "yellow" : "red")
          }}>
            <span>Rover:&nbsp;</span>
            <span>{evaData.rover.completed ? "Completed" : (evaData.rover.started ? "In Progress" : "Not Started")}</span>
          </div>
        </div>
      </ div>
    </div>
  );
}

export default Mission;