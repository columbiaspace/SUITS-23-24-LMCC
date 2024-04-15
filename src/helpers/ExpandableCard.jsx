import React, { useState } from 'react';

const ExpandableCard = ({ title, steps }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to manage card expansion

  // Function to toggle card expansion state
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card" onClick={toggleExpansion}>
      <h3 className="card-title">{title}</h3>
      {isExpanded && ( // Only render the content if the card is expanded
        <div className="card-content">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <h4>{step.main}</h4>
              <ul>
                {step.subSteps.map((subStep, subIndex) => (
                  <li key={subIndex}>{subStep}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;