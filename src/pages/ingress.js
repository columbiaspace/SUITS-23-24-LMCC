import React, { useState } from 'react';
import './../pages-style/ingress.css';
import { ProcedureList } from '../helpers/ProcedureList';
import ProcedureItem from '../components/ProcedureItem';


function Ingress() {
  const [currentProcedure, setCurrentProcedure] = useState(0);

  const handleNextProcedure = () => {
    setCurrentProcedure((prevIndex) => (prevIndex + 1) % ProcedureList.length);
  };

  const handlePrevProcedure = () => {
    setCurrentProcedure((prevIndex) => (prevIndex - 1 + ProcedureList.length) % ProcedureList.length);
  };

  return (
    <div className="ingress-container">
      <div className="left-column">
        <h1>Ingress</h1>
        <p>This page will display ingress procedures</p>
      </div>
      <div className="ProcedureList">
        {ProcedureList.map((Item, index) => (
          <ProcedureItem
            key={index}
            name={Item.name}
            description={Item.description}
            className={index === currentProcedure ? 'show' : ''}
          />
        ))}
        <div className="navigation-buttons">
          <button onClick={handlePrevProcedure}>&lt; Previous</button>
          <button onClick={handleNextProcedure}>Next &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default Ingress;