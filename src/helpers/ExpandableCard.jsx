import React, { useState } from 'react';
import './../helpers/ExpandableCard.css';

const ExpandableCard = ({ title, steps }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card" onClick={toggleExpansion}>
    
      <h3 className="card-title">{title}</h3>
      {isExpanded && (
        <div className={isExpanded ? "card-content show" : "card-content"}>
          {steps.map((step, index) => (
            <div key={index} className="step">
              <h4>{step.step} - {step.role}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;
