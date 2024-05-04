import React from "react";
import "../../pages-style/page.css";
import "../../pages-style/nav.css";
import Map from "../../components/Map";

function nav() {
  return (
      <div id="navPage" className="pagecontainer">
        <h1>Navigation</h1>
        <div className="map-container">
          <Map />
        </div>
      </div>
  );
}

export default nav;
