import React, { useState } from 'react';
import ExpandableCard from "../../helpers/ExpandableCard.jsx";
import "../../pages-style/page.css";
import equipmentData from "../../assets/ProcedureLists/EquipmentRepair.json";

const EquipmentPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [procedureData, setProcedureData] = useState({ title: '', steps: [] });
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [procedures, setProcedures] = useState([]);

  const handleAddNewProcedure = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleNext = () => {
    if (currentStep === 0) { // Set title
      setProcedureData(prevData => ({ ...prevData, title: inputValue }));
    } else if (currentStep % 2 === 1) { // Set subtitle
      setProcedureData(prevData => ({
        ...prevData,
        steps: [...prevData.steps, { step: `Subtitle ${Math.ceil(currentStep / 2)}: ${inputValue}`, description: '' }]
      }));
    } else { // Set main text
      const newSteps = [...procedureData.steps];
      newSteps[newSteps.length - 1].description = inputValue;
      setProcedureData(prevData => ({ ...prevData, steps: newSteps }));
    }
    setCurrentStep(prevStep => prevStep + 1);
    setInputValue('');
  };

  const handleContinue = (shouldContinue) => {
    if (!shouldContinue) {
      if (currentStep % 2 === 0) { // Ensure the last main text is included
        const newSteps = [...procedureData.steps];
        if (newSteps.length > 0) {
          newSteps[newSteps.length - 1].description = inputValue;
          setProcedureData(prevData => ({ ...prevData, steps: newSteps }));
        }
      }
      setProcedures(prevProcedures => [...prevProcedures, procedureData]);
      setShowModal(false);
      setProcedureData({ title: '', steps: [] });
      setCurrentStep(0);
      setInputValue('');
    }
  };

  return (
    <div className="pagecontainer">
      <div className="container">
        <div className="header-area">
          <h2>Equipment Repair</h2>
          <button onClick={handleAddNewProcedure} className="add-procedure-btn">Add New Procedure</button>
        </div>
        {Object.entries(equipmentData).map(([title, steps]) => (
          <ExpandableCard key={title} title={title} steps={steps} />
        ))}
        {procedures.map((procedure, index) => (
          <ExpandableCard key={index} title={procedure.title} steps={procedure.steps} />
        ))}
        {showModal && (
          <div className="modal">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={currentStep === 0 ? 'Title:' : currentStep % 2 === 1 ? 'Subtitle:' : 'Main text:'}
            />
            <button onClick={handleNext}>Next</button>
            {(currentStep > 1 || (currentStep === 1 && procedureData.steps.length > 0)) && (
              <button onClick={() => handleContinue(false)}>Finish</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentPage;
