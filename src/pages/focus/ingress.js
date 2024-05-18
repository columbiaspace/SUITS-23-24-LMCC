import React, { useState, useRef } from 'react';
import '../../pages-style/ingressegress.css';
import '../../pages-style/page.css'
import { IngressProcedureList } from '../../assets/ProcedureLists/IngressProcedureList';
import ProcedureItem from '../../components/ProcedureItem';

function Ingress() {
  const [currentProcedure, setCurrentProcedure] = useState(0);
  const procedureDropdownRef = useRef(null);

  const handleProcedureChange = () => {
    const selectedIndex = procedureDropdownRef.current.selectedIndex;
    setCurrentProcedure(selectedIndex);
  };

  return (
    <div className="ingressegress-container">
      <div className="left-column">
        {IngressProcedureList[currentProcedure].image && (
          <img src={IngressProcedureList[currentProcedure].image} alt={IngressProcedureList[currentProcedure].name} />
        )}
      </div>
      <div className="right-column">
        <h2>Select Procedure</h2>
        <div className="select-container">
          <select ref={procedureDropdownRef} onChange={handleProcedureChange} value={currentProcedure}>
            {IngressProcedureList.map((Item, index) => (
              <option key={index} value={index}>{Item.name}</option>
            ))}
          </select>
        </div>
        <div className="ProcedureList">
          <ProcedureItem
            name={IngressProcedureList[currentProcedure].name}
            description={IngressProcedureList[currentProcedure].description}
            className="show"
          />
        </div>
        <div className="navigation-buttons">
          <button onClick={() => setCurrentProcedure((prevIndex) => (prevIndex - 1 + IngressProcedureList.length) % IngressProcedureList.length)}>&lt; Previous</button>
          <button onClick={() => setCurrentProcedure((prevIndex) => (prevIndex + 1) % IngressProcedureList.length)}>Next &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default Ingress;
