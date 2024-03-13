import React from 'react';
import './../pages-style/rocks.css';
import { ProcedureList } from '../helpers/ProcedureList';
import ProcedureItem from '../components/ProcedureItem';


function Rocks() {
  return (
    <div>
      <h1>Rocks</h1>
      <p>This page will display samples that have been collected, and what samples should be kept</p>
      <div className="ProcedureList">
        {ProcedureList.map((Item, key) => {
          return (
            <ProcedureItem
              key={key}
              name={Item.name}
              description={Item.description}
            />
          );
        })}
      </div>
      <button onClick={handleShowWarning}>Show Warning</button>

      {showWarning && (
        <div className="warning-modal">
          <div className="warning-modal-content">
            <span className="close" onClick={handleCloseWarning}>&times;</span>
            <p>Warning: Are you sure you want to proceed?</p>
            <button onClick={handleCloseWarning}>Yes, Proceed</button>
      <h1>Geological Sampling</h1>
        <div className="container">
          { /* Maps Column on the left half */ }
          <div className="column">
            <div className="maps-container">
              <div className="subcontainer astronaut-loc-container">
                <h2>Astronaut Location</h2>
              </div>
              <div className="subcontainer sampling-map-container">
                <h2>Sample Map</h2>
              </div>
            </div>
            <div className="points-of-interest-container">
              <h2>Points of Interest</h2>
            </div>
          </div>
          { /* Rocks Column on the right half */ }
          <div className="column">
            <h2>Table of Rocks</h2>
          </div>
        </div>
    </div>
  );
}

export default Rocks;