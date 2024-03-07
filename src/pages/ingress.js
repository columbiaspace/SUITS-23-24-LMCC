import React from 'react';
import './../pages-style/ingress.css';
import { ProcedureList } from '../helpers/ProcedureList';
import ProcedureItem from '../components/ProcedureItem';

function ingress() {
  return (
    <div>
      <h1>Ingress</h1>
      <p>This page will display ingress procedures</p>
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

export default ingress;