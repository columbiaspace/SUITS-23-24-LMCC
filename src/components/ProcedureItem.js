import React from 'react'

function ProcedureItem({name, description}) {
    return (
        <div className="ProcedureItem" >
            <h1>{name}</h1>
            <p>{description}</p>

        </div>


    );
}

export default ProcedureItem;