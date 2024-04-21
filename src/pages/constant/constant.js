import "../../pages-style/constant.css";
import "../../pages-style/page.css"
import Astronaut from "./astronaut";
import Mission from "./mission";
import Rover from "./rover";

function Constant() {
  return (
    <div className="pagecontainer" id="constantpage">
      <div id="lcol"><Astronaut /></div>
      <div id="mcol"><Mission /></div>
      <div id="rcol"><Rover /></div>
    </div>
  );
}

export default Constant;
