import React from 'react';
import './../pages-style/nav.css';
import Map from '../components/Map';

function nav() {
  return (
    <div className='navPage'>
      <h1>Navigation</h1>

      <div className="map-container">
          <Map />
      </div>
    </div>
  );
}

export default nav;