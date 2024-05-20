import React from 'react'; 
import "./constant.css";
import "../../pages-style/page.css";

const TopBar = ({ telemetryData, getStatusClass, formatTime }) => {
  const defaultStatusClass = 'status-indicator red';
  const defaultTime = '00:00:00';

  const safeGetStatusClass = (started, completed) => {
    try {
      return getStatusClass(started, completed);
    } catch (error) {
      console.error('Error getting status class:', error);
      return defaultStatusClass;
    }
  };

  const renderStatus = (data) => {
    if (!data) return defaultStatusClass;
    const { started, completed } = data;
    return safeGetStatusClass(started, completed);
  };

  const renderTime = (time) => {
    return time !== undefined ? formatTime(time) : defaultTime;
  };

  const eva = telemetryData?.eva?.eva;

  return (
    <div id="topbar">
      <div className={eva ? renderStatus(eva) : defaultStatusClass}>
        EVA<br />
        {eva ? renderTime(eva.total_time) : defaultTime}
      </div>
      <div className={eva?.uia ? renderStatus(eva.uia) : defaultStatusClass}>
        UIA<br />
        {eva?.uia ? renderTime(eva.uia.time) : defaultTime}
      </div>
      <div className={eva?.spec ? renderStatus(eva.spec) : defaultStatusClass}>
        SPEC<br />
        {eva?.spec ? renderTime(eva.spec.time) : defaultTime}
      </div>
      <div className={eva?.rover ? renderStatus(eva.rover) : defaultStatusClass}>
        ROVER<br />
        {eva?.rover ? renderTime(eva.rover.time) : defaultTime}
      </div>
      <div className={eva?.dcu ? renderStatus(eva.dcu) : defaultStatusClass}>
        DCU<br />
        {eva?.dcu ? renderTime(eva.dcu.time) : defaultTime}
      </div>
    </div>
  );
};

export default TopBar;
