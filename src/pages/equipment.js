import React from 'react';
import ExpandableCard from './../helpers/ExpandableCard'; // Ensure the path is correct

const EquipmentPage = () => {
  // Complete details for the Cable Repair card
  const repairDetails = {
    title: 'CABLE REPAIR',
    steps: [
      {
        main: '1. Shut down comm tower (EV1)',
        subSteps: [
          'a. Select power button on screen',
          'b. Select shut down option',
          'c. Relay system shutdown complete'
        ]
      },
      {
        main: '2. Power down MMRTG (EV2)',
        subSteps: [
          'a. Set power switch to off position',
          'b. Relay power down to MCC',
          'c. Return to comm tower for cable swap task'
        ]
      },
      {
        main: '3. Cable swap',
        subSteps: [
          'a. Retrieve functional cable (EV1)',
          'b. Take one end of cable to MMRTG site, relay when arrived (EV2)',
          'c. Disconnect damaged cable from comm tower, relay when complete (EV1)',
          'd. Disconnect damaged cable from MMRTG, relay when complete (EV2)',
          'e. Connect functional cable to comm tower, relay when complete (EV1)',
          'f. Connect functional cable to MMRTG, relay when complete (EV2)',
          'g. Relay cable swap complete to MCC (EV1)'
        ]
      },
      {
        main: '4. Restore power',
        subSteps: [
          'a. Set MMRTG power switch to on position (EV2)',
          'b. Power on comm tower by pressing power button (EV1)',
          'c. Wait for system start up (EV1)',
          'd. Relay successful system start (EV1)'
        ]
      },
      {
        main: '5. Verify Successful Repair (Both EVs)',
        subSteps: [
          'a. Verify channel is live on comm tower display',
          'b. Test if comm channel is functional',
          'i. Follow channel switch protocol',
          'ii. Protocol:',
          '    1. MCC relays channel switch start',
          '    2. EV will swap to repaired channel',
          '    3. If no comms are received within 10 seconds, EV will return to working channel',
          '    4. Otherwise proceed',
          'c. Wait for go to proceed from MCC'
        ]
      }
    ]
  };

  return (
    <div>
      <h2>Equipment Repair</h2>
      <ExpandableCard title={repairDetails.title} steps={repairDetails.steps} />
    </div>
  );
};

export default EquipmentPage;