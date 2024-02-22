import React, { useState } from 'react';
import './../pages-style/rocks.css';

import { ProcedureList } from '../helpers/ProcedureList';
import ProcedureItem from '../components/ProcedureItem';
function rocks() {


function Rocks() {
  const [showWarning, setShowWarning] = useState(false);

  const handleShowWarning = () => {
    setShowWarning(true);
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  return (
    <div>
      <h1>Rocks</h1>
      <p>This page will display samples that have been collected, and what samples should be kept</p>
      <div className = "ProcedureList"> 
      {ProcedureList.map((Item, key) =>{
          <ProcedureItem
          key = {key}
          name = {Item.name}
          description = {Item.description}
          />
        )
      })}
      </div>
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

export default Rocks;
