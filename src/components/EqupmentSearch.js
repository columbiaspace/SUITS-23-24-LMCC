import React, { useState } from 'react';
import proceduresData from '..assets/ProcedureLists/equipmentprocedures.json';

const EquipmentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedProcedure(null);
  };

  const handleProcedureSelect = (procedure) => {
    setSelectedProcedure(procedure);
  };

  const filteredProcedures = Object.entries(proceduresData).flatMap(([category, procedures]) =>
    procedures.filter(procedure =>
      procedure.description.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(procedure => ({ ...procedure, category }))
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search procedures..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div>
        {filteredProcedures.map((procedure, index) => (
          <div key={index} onClick={() => handleProcedureSelect(procedure)}>
            {procedure.step}: {procedure.description}
          </div>
        ))}
      </div>
      {selectedProcedure && (
        <div>
          <h3>Selected Procedure</h3>
          <p><strong>Category:</strong> {selectedProcedure.category}</p>
          <p><strong>Step:</strong> {selectedProcedure.step}</p>
          <p><strong>Role:</strong> {selectedProcedure.role}</p>
          <p><strong>Description:</strong> {selectedProcedure.description}</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentSearch;
