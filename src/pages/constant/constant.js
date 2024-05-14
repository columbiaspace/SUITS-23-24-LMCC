import React from 'react';
import { GlobalProvider } from '../../components/GlobalContext'; // Ensure this path is correct
import "./constant.css";
import StreamComponent from "../../components/StreamComponent.js";
import RoverCam from "../../components/RoverCamera.js";
import "../../pages-style/page.css";
import EVData from './EVData.js';
import Map from '../../components/Map.js';

function Constant() {
  return (
    <GlobalProvider>
      <div className="pagecontainer" id="constantpage">
        <div id="topbar"></div>
        <div id="centerbar"></div>
        <div className="top-half">
          <div id="HMDStream"><StreamComponent /></div>
          <div id="RoverStream"><RoverCam /></div>
        </div>
        <div className="bottom-half">
          <div id="EV1"><EVData evNumber={1} /></div>
          <div id="Map"><Map /></div>
          <div id="EV2"><EVData evNumber={2} /></div>
        </div>
      </div>
    </GlobalProvider>
  );
}

export default Constant;
