import React from 'react'

function ProcedureItem({name, description, className}) {
    return (
        <div className={`ProcedureItem ${className}`}>
            <h1>{name}</h1>
            <p>{description}</p>

        </div>


    );
}

export default ProcedureItem;