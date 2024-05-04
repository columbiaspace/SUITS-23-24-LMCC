let TSS_IP = "127.0.0.1:14141"; 
let HOLO_IP = "126.10.204.3";
let MapBox_API = "pk.something";
let SERVER_IP = "127.0.0.1:8000"

export const setTSS_IP = (newTSS_IP) => {
  TSS_IP = newTSS_IP;
};

export const getTSS_IP = () => {
  return TSS_IP;
};

export const setSERVER_IP = (newSERVER_IP) => {
  SERVER_IP = newSERVER_IP;
};

export const getSERVER_IP = () => {
  return SERVER_IP;
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