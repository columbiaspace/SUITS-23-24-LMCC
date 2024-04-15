import image1 from '../Images/DCU_Front.jpg';
import image2 from '../Images/Ingress2.jpg';
import image3 from '../Images/Ingress3.jpg';
import image4 from '../Images/Ingress4.jpg';
// Assuming you have images, change accordingly

export const IngressProcedureList = [
  {
    name: 'Connect UIA to DCU and start Depress',
    description: 'UIA and DCU \t1. EV1 and EV2 connect UIA and DCU umbilical \nUIA \t2. EV-1, EV-2 EMU PWR - ON\nBOTH DCU \t3. BATT - UMB',
    image: image1,
  },
  {
    name: 'Vent O2 Tanks',
    description: 'UIA 1. OXYGEN O2 VENT - OPEN\nHMD 2. Wait until both Primary and Secondary OXY tanks are < 10psi\nUIA 3. OXYGEN O2 VENT - CLOSE',
    image: image2,
  },
  {
    name: 'Empty Water Tanks',
    description: 'BOTH DCU 1. PUMP - OPEN\nUIA 2. EV-1, EV-2 WASTE WATER - OPEN\nHMD 3. Wait until water EV1 and EV2 Coolant tank is < 5%\nUIA 4. EV-1, EV-2 WASTE WATER - CLOSE',
    image: image3,
  },
  {
    name: 'Disconnect UIA from DCU',
    description: 'UIA 1. EV-1, EV-2 EMU PWR - OFF\nDCU 2. EV1 and EV2 disconnect umbilical',
    image: image4,
  },

];
