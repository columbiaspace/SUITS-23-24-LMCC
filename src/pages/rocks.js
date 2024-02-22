import React from 'react';
import './../pages-style/rocks.css';
import { ProcedureList } from '../helpers/ProcedureList';
import ProcedureItem from '../components/ProcedureItem';
function rocks() {
  return (
    <div>
      <h1>Rocks</h1>
      <p>This page will display samples that have been collected, and what samples should be kept</p>
      <div className = "ProcedureList"> 
      {ProcedureList.map((Item, key) =>{
        return (
          <ProcedureItem
          key = {key}
          name = {Item.name}
          description = {Item.description}
          />
        )
      })}
      </div>
    </div>
  );
}

export default rocks;