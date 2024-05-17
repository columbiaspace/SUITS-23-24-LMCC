import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages-style/equipment.css';

const Equipment = () => {
    const [procedures, setProcedures] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = () => {
        axios.get('http://localhost:8000/get_equipment_procedures')
            .then(response => {
                console.log(response.data); // Debugging: Log the fetched data
                setProcedures(response.data || []);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            });
    };

    useEffect(() => {
        fetchData();  // Fetch initially

        const interval = setInterval(() => {
            fetchData();
        }, 3000);  // Fetch every 3 seconds

        return () => clearInterval(interval);  // Cleanup on unmount
    }, []);

    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="container">
            {procedures.length > 0 ? (
                procedures.map(procedure => (
                    <div key={procedure.id}>
                        <h2>{procedure.title}</h2>
                        <ul>
                            {procedure.steps.map((step, index) => (
                                <li key={index}>
                                    <strong>{step.step} ({step.role})</strong>: {step.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <div>No procedures found.</div>
            )}
        </div>
    );
};

export default Equipment;
