import React, { useState } from 'react';
import './../pages-style/egress.css';

function Egress() {
  const [showWarning, setShowWarning] = useState(false);

  const handleShowWarning = () => {
    setShowWarning(true);
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  return (
    <div>
      <h1>Egress</h1>
      <p>This page will display samples that have been collected, and what samples should be kept</p>
      
      <button onClick={handleShowWarning}>Show Warning</button>

      {showWarning && (
        <div className="warning-modal">
          <div className="warning-modal-content">
            <span className="close" onClick={handleCloseWarning}>&times;</span>
            <p>Warning: Are you sure you want to proceed?</p>
            <button onClick={handleCloseWarning}>Yes, Proceed</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Egress;