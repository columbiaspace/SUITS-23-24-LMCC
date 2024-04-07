import image1 from '../Images/DCU_Front.jpg'; // Assuming you have images, change accordingly

export const IngressProcedureList = [
  {
    name: 'Connect UIA to DCU and start Depress',
    description: 'UIA and DCU 1. EV1 and EV2 connect UIA and DCU umbilical \nUIA 2. EV-1, EV-2 EMU PWR - ON\nBOTH DCU 3. BATT - UMB',
    image: image1,
  },
  {
    name: 'Vent O2 Tanks',
    description: 'UIA 1. OXYGEN O2 VENT - OPEN\nHMD 2. Wait until both Primary and Secondary OXY tanks are < 10psi\nUIA 3. OXYGEN O2 VENT - CLOSE',
    image: null,
  },
  {
    name: 'Empty Water Tanks',
    description: 'BOTH DCU 1. PUMP - OPEN\nUIA 2. EV-1, EV-2 WASTE WATER - OPEN\nHMD 3. Wait until water EV1 and EV2 Coolant tank is < 5%\nUIA 4. EV-1, EV-2 WASTE WATER - CLOSE',
    image: null,
  },
  {
    name: 'Disconnect UIA from DCU',
    description: 'UIA 1. EV-1, EV-2 EMU PWR - OFF\nDCU 2. EV1 and EV2 disconnect umbilical',
    image: null,
  },

];
