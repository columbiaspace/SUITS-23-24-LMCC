import "./constant2.css";
import StreamComponent from "../../components/StreamComponent.js";
import RoverCam from "../../components/RoverCamera.js";
import "../../pages-style/page.css";
import EVData from './EVData';
import Map from '../../components/Map';


function Constant() {
  return (
    <div className="pagecontainer" id="constantpage">
        <div id="topbar"></div>
        <div id="centerbar"></div>
        <div className="top-half">
            <div id="HMDStream"> <StreamComponent /> </div>
            <div id="RoverStream"> <RoverCam /> </div>
        </div>
        <div className="bottom-half">
            <div id="EV1"> <EVData evNumber={1} /> </div>
            <div id="Map"> < Map /> </div>
            <div id="EV2"> <EVData evNumber={2} /> </div>
        </div>
    </div>
  );
}

export default Constant;
