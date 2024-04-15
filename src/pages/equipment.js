import React from 'react';
import ExpandableCard from './../helpers/ExpandableCard.jsx';
import equipmentData from './../assets/ProcedureLists/EquipmentRepair.json'; 

const EquipmentPage = () => {
  return (
    <div className="container">  
      <h2>Equipment Repair</h2>
      {Object.entries(equipmentData).map(([title, steps]) => (
        <ExpandableCard key={title} title={title} steps={steps} />
      ))}
    </div>
  );
};

export default EquipmentPage;