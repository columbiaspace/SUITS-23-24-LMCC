import React, { useState } from 'react';
import './../pages-style/ingressegress.css';
import { IngressProcedureList } from '../assets/ProcedureLists/IngressProcedureList';
import ProcedureItem from '../components/ProcedureItem';


function Ingress() {
  const [currentProcedure, setCurrentProcedure] = useState(0);

  const handleNextProcedure = () => {
    setCurrentProcedure((prevIndex) => (prevIndex + 1) % IngressProcedureList.length);
  };

  const handlePrevProcedure = () => {
    setCurrentProcedure((prevIndex) => (prevIndex - 1 + IngressProcedureList.length) % IngressProcedureList.length);
  };

  return (
    <div className="ingressegress-container">
      <div className="left-column">
        <h1>Ingress</h1>
        {IngressProcedureList[currentProcedure].image && (
          <img src={IngressProcedureList[currentProcedure].image} alt={IngressProcedureList[currentProcedure].name} />
        )}
      </div>
      <div className="ProcedureList">
        {IngressProcedureList.map((Item, index) => (
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