import React, { useState } from 'react';
import '../../pages-style/ingressegress.css';
import '../../pages-style/page.css'
import { EgressProcedureList } from '../../assets/ProcedureLists/EgressProcedureList';
import ProcedureItem from '../../components/ProcedureItem';


function Egress() {
  const [currentProcedure, setCurrentProcedure] = useState(0);

  const handleNextProcedure = () => {
    setCurrentProcedure((prevIndex) => (prevIndex + 1) % EgressProcedureList.length);
  };

  const handlePrevProcedure = () => {
    setCurrentProcedure((prevIndex) => (prevIndex - 1 + EgressProcedureList.length) % EgressProcedureList.length);
  };

  return (
    <div className="pagecontainer">
      <div className="left-column">
        <h1>Ingress</h1>
        {EgressProcedureList[currentProcedure].image && (
          <img src={EgressProcedureList[currentProcedure].image} alt={EgressProcedureList[currentProcedure].name} />
        )}
      </div>
      <div className="ProcedureList">
        {EgressProcedureList.map((Item, index) => (
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

export default Egress;