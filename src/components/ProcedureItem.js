import React from 'react';
import './procedureitem.css';

function ProcedureItem({ name, description, className }) {
    const descriptionItems = description.split('\n').map((item, index) => (
        <li key={index}>{item}</li>
    ));

    return (
        <div className={`ProcedureItem ${className}`}>
            <h1>{name}</h1>
            <ul className='procedureDescription'>{descriptionItems}</ul>
        </div>
    );
}

export default ProcedureItem;
