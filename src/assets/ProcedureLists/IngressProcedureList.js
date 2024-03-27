import image1 from '../Images/DCU_Front.jpg'; // Assuming you have images, change accordingly

export const IngressProcedureList = [
  {
    name: '2 Connect UIA to DCU',
    description: 'a. PLUG: Connect UIA and DCU via the cable\nb. SWITCH: UIA EMU POWER-> ON (activates the Umbilical on the UIA side)\nc. SWITCH: DCU BATT -> Umbilical (activated the Umbilical on the DCU side)',
    image: image1,
  },
  {
    name: 'Vent O2 Tanks',
    description: 'SWITCH: UIA OXY VENT -> ON (vents the content of the primary tank)',
    image: null,
  },
  {
    name: 'Wait until Primary and secondary OXY Tanks are empty',
    description: 'SWITCH: UIA OXY VENT -> OFF (conclude venting the primary tank)',
    image: null,
  },
  {
    name: 'Flush Water Coolant',
    description: 'a. SWITCH: DCU PUMP -> OPEN (Allows coolant to flow between suits and UIA)\nb. SWITCH: UIA WATER WASTE -> ON/OPEN (flushes the water coolant out of suit)',
    image: null,
  },
  {
    name: 'Wait until Water Coolant Tank is empty',
    description: 'SWITCH: UIA WATER WASTE -> OFF (conclude flushing the water coolant)',
    image: null,
  },
  {
    name: 'Disconnect IMU to DCU',
    description: 'a. SWITCH: UIA EMU POWER-> OFF (deactivated the Umbilical on the UIA side)\nb. UNPLUG: Connect UIA and DCU via the cable',
    image: null,
  },
  // Add more procedures as needed
];
