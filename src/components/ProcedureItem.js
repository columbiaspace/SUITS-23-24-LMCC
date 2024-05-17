import React from 'react';

function ProcedureItem({ name, description, className }) {
    const descriptionItems = description.split('\n').map((item, index) => (
        <li key={index}>{item}</li>
    ));

    return (
        <div className={`ProcedureItem ${className}`}>
            <ul className='procedureDescription'>{descriptionItems}</ul>
        </div>
    );
}

export default ProcedureItem;