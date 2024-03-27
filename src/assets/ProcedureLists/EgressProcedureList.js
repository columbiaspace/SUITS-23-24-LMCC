import image1 from '../Images/DCU_Front.jpg';
import image2 from '../Images/dog2.png';
import image3 from '../Images/dog3.png';
import supplywaste from '../Images/supplywaste.jpg'
export const EgressProcedureList = [
  {
    name: 'Connect UIA to DCU',
    description: 'a. PLUG: Connect UIA and DCU via the cable\nb. SWITCH: UIA EMU POWER-> ON (activates the Umbilical on the UIA side)\nc. SWITCH: DCU BATT -> Umbilical (activated the Umbilical on the DCU side)',
    image: image1,
  },
  {
    name: 'Begin Depress of Suit',
    description: 'SWITCH: UIA Depress -> ON (This will take a few minutes)',
    image: image2,
  },
  {
    name: 'Vent O2 Tanks',
    description: 'SWITCH: UIA OXY VENT -> ON (vents the content of the primary tank)',
    image: image3,
  },
  {
    name: 'Prepare O2 Tanks',
    description: 'a. SWITCH: DCU OXY -> Primary (sets the primary tank as the active tank)\nb. SWITCH: UIA OXY SUPPLY -> ON (fills the primary tank with oxygen)',
    image: null,
  },
  {
    name: 'Fill Secondary Tank',
    description: 'a. SWITCH: DCU OXY -> Secondary (sets the secondary tank as the active tank)\nb. SWITCH: UIA OXY SUPPLY -> ON (fills the secondary tank with oxygen)',
    image: null,
  },
  {
    name: 'Prepare Water Coolant',
    description: 'SWITCH: DCU PUMP -> OPEN (Allows coolant to flow between suits and UIA)',
    image: null,
  },
  {
    name: 'Flush Water Coolant',
    description: 'SWITCH: UIA WATER WASTE -> ON/OPEN (flushes the water coolant out of suit)',
    image: supplywaste,
  },
  {
    name: 'Fill Water Coolant',
    description: 'SWITCH: UIA WATER SUPPLY -> ON (supplies the water coolant to suit)',
    image: supplywaste,
  },
  {
    name: 'End Depress of Suit',
    description: 'SWITCH: UIA Depress -> OFF',
    image: null,
  },
  {
    name: 'Double Check DCU Switch States',
    description: 'a. SWITCH: DCU BATT -> LOCAL\nb. SWITCH: DCU CO2 -> A (CO2 Scrubber, will need to flip every 10-15 minutes)',
    image: null,
  },
  {
    name: 'Disconnect IMU to DCU',
    description: 'a. SWITCH: UIA EMU POWER-> OFF (deactivated the Umbilical on the UIA side)\nb. UNPLUG: Disconnect UIA and DCU via the cable',
    image: null,
  },
  // Add more procedures as needed
];
