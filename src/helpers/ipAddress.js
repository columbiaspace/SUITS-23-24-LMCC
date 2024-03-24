let TSS_IP = "None"; 
let HOLO_IP = "None";
let MapBox_API = "None";

export const setTSS_IP = (newTSS_IP) => {
  TSS_IP = newTSS_IP;
};

export const getTSS_IP = () => {
  return TSS_IP;
};

export const setHOLO_IP = (newHOLO_IP) => {
  HOLO_IP = newHOLO_IP;
};

export const getHOLO_IP = () => {
  return HOLO_IP;
};

export const setMapBox_API = (newMapBox_API) => {
  MapBox_API = newMapBox_API;
};

export const getMapBox_API = () => {
  return MapBox_API;
};
/* How to call it
import { getTSS_IP } from './../helpers/ipAddress.js';

function Equipment() {
  const TSS_IP = getTSS_IP(); // Get the IP address

  return (
    <div>
      <h1>Equipment</h1>
      <p>This page should show procedures for equipment repair scenarios, potentially in some form of dictionary</p>
      <h2>Current IP Address: {TSS_IP}</h2>
    </div>
  );
}

export default Equipment;
*/