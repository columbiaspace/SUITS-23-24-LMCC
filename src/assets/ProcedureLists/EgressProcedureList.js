import image1 from '../Images/DCU_Front.jpg';
import image2 from '../Images/dog2.png';
import image3 from '../Images/dog3.png';
// import supplywaste from '../Images/supplywaste.jpg'
export const EgressProcedureList = [
  {
    name: 'Connect UIA to DCU and start Depress',
    description: 'UIA and DCU 1. EV1 and EV2 connect UIA and DCU umbilical\nUIA 2. EV-1, EV-2 PWR - ON\nBOTH DCU 3. BATT - UMB\nUIA 4. DEPRESS PUMP PWR - ON',
    image: image1,
  },
  {
    name: 'Prep O2 Tanks',
    description: 'UIA 1. OXYGEN O2 VENT - OPEN\nHMD 2. Wait until both Primary and Secondary OXY tanks are < 10psi\nUIA 3. OXYGEN O2 VENT - CLOSE\nBOTH DCU 4. OXY - PRI\nUIA 5. OXYGEN EMU-1, EMU-2 - OPEN\nHMD 6. Wait until EV1 and EV2 Primary O2 tanks > 3000 psi\nUIA 7. OXYGEN EMU-1, EMU-2 - CLOSE\nBOTH DCU 8. OXY - SEC\nUIA 9. OXYGEN EMU-1, EMU-2 - OPEN\nHMD 10. Wait until EV1 and EV2 Secondary O2 tanks > 3000 psi\nUIA 11. OXYGEN EMU-1, EMU-2 - CLOSE\nBOTH DCU 12. OXY - PRI',
    image: image2,
  },
  {
    name: 'Prep Water Tanks',
    description: 'BOTH DCU 1. PUMP - OPEN\nUIA 2. EV-1, EV-2 WASTE WATER - OPEN\nHMD 3. Wait until water EV1 and EV2 Coolant tank is < 5%\nUIA 4. EV-1, EV-2 WASTE WATER - CLOSE\nUIA 5. EV-1, EV-2 SUPPLY WATER - OPEN\nHMD 6. Wait until water EV1 and EV2 Coolant tank is > 95%\nUIA 7. EV-1, EV-2 SUPPLY WATER - CLOSE\nBOTH DCU 8. PUMP - CLOSESWITCH: UIA OXY VENT -> ON (vents the content of the primary tank)',
    image: image3,
  },
  {
    name: 'END Depress, Check Switches and Disconnect',
    description: 'HMD 1. Wait until SUIT P, O2 P = 4\nUIA 2. DEPRESS PUMP PWR - OFF\nBOTH DCU 3. BATT - LOCAL\nUIA 9. EV-1, EV-2 PWR - OFF\nBOTH DCU 4. Verify OXY - PRI\nBOTH DCU 5. Verify COMMS - A\nBOTH DCU 6. Verify FAN - PRI\nBOTH DCU 7. Verify PUMP - CLOSE\nBOTH DCU 8. Verify CO2 - A\nUIA and DCU 9. EV1 and EV2 disconnect UIA and DCU umbilical',
    image: null,
  },

  // Add more procedures as needed
];
