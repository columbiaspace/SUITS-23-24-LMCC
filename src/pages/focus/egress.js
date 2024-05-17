import React, { useState, useRef, useEffect } from 'react';
import '../../pages-style/ingressegress.css';
import '../../pages-style/page.css';
import { EgressProcedureList } from '../../assets/ProcedureLists/EgressProcedureList';
import ProcedureItem from '../../components/ProcedureItem';

function Ingress() {
  const [currentProcedure, setCurrentProcedure] = useState(0);
  const procedureDropdownRef = useRef(null);
  const rightColumnRef = useRef(null);
  const procedureListRef = useRef(null);

  const handleProcedureChange = () => {
    const selectedIndex = procedureDropdownRef.current.selectedIndex;
    setCurrentProcedure(selectedIndex);
  };

  const adjustFontSize = () => {
    const rightColumn = rightColumnRef.current;
    const procedureList = procedureListRef.current;

    if (rightColumn.scrollHeight > window.innerHeight * 0.9) {
      let fontSize = 16;
      while (rightColumn.scrollHeight > window.innerHeight * 0.9 && fontSize > 10) {
        fontSize -= 1;
        procedureList.style.fontSize = `${fontSize}px`;
      }
    } else {
      procedureList.style.fontSize = '16px'; // Reset to initial font size if no overflow
    }
  };

  useEffect(() => {
    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [currentProcedure]);

  useEffect(() => {
    adjustFontSize();
  }, [currentProcedure]);

  return (
    <div className="ingressegress-container">
      <div className="left-column">
        {EgressProcedureList[currentProcedure].image && (
          <img src={EgressProcedureList[currentProcedure].image} alt={EgressProcedureList[currentProcedure].name} />
        )}
      </div>
      <div className="right-column" ref={rightColumnRef}>
        <h2>Select Procedure</h2>
        <div className="select-container">
          <select ref={procedureDropdownRef} onChange={handleProcedureChange} value={currentProcedure}>
            {EgressProcedureList.map((Item, index) => (
              <option key={index} value={index}>{Item.name}</option>
            ))}
          </select>
        </div>
        <div className="ProcedureList" ref={procedureListRef}>
          <ProcedureItem
            description={EgressProcedureList[currentProcedure].description}
            className="show"
          />
        </div>
        <div className="navigation-buttons">
          <button onClick={() => setCurrentProcedure((prevIndex) => (prevIndex - 1 + EgressProcedureList.length) % EgressProcedureList.length)}>&lt; Previous</button>
          <button onClick={() => setCurrentProcedure((prevIndex) => (prevIndex + 1) % EgressProcedureList.length)}>Next &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default Ingress;
