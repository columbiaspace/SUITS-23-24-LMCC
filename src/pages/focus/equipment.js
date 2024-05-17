import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages-style/equipment.css';

const Equipment = () => {
    const [procedures, setProcedures] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newProcedure, setNewProcedure] = useState({
        id: '',
        title: '',
        steps: []
    });
    const [newStep, setNewStep] = useState({
        step: '',
        role: '',
        description: ''
    });

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

    const handleAddStep = () => {
        setNewProcedure({
            ...newProcedure,
            steps: [...newProcedure.steps, newStep]
        });
        setNewStep({
            step: '',
            role: '',
            description: ''
        });
    };

    const handleSubmit = () => {
        axios.post('http://localhost:8000/add_procedure', newProcedure)
            .then(response => {
                console.log('Procedure added:', response.data);
                setShowModal(false);
                setNewProcedure({
                    id: '',
                    title: '',
                    steps: []
                });
                fetchData();
            })
            .catch(error => {
                console.error('Error adding procedure:', error);
                setError('Error adding procedure');
            });
    };

    if (error) return <div id="error">Error: {error}</div>;

    return (
        <div id="container">
            <button onClick={() => setShowModal(true)}>Add New Procedure</button>
            {procedures.length > 0 ? (
                procedures.map(procedure => (
                    <div key={procedure.id} className="procedure-card">
                        <div className="procedure-header">
                            <h2>{procedure.title}</h2>
                            <h4>#{procedure.id}</h4>
                        </div>
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

            {showModal && (
                <div id="modal">
                    <div id="modal-content">
                        <span id="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Add New Procedure</h2>
                        <div className="form-group">
                            <label>Procedure ID:</label>
                            <input
                                type="number"
                                value={newProcedure.id}
                                onChange={(e) => setNewProcedure({ ...newProcedure, id: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Title:</label>
                            <input
                                type="text"
                                value={newProcedure.title}
                                onChange={(e) => setNewProcedure({ ...newProcedure, title: e.target.value })}
                            />
                        </div>
                        <h3>Add Step</h3>
                        <div className="form-group">
                            <label>Step:</label>
                            <input
                                type="text"
                                value={newStep.step}
                                onChange={(e) => setNewStep({ ...newStep, step: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Role:</label>
                            <input
                                type="text"
                                value={newStep.role}
                                onChange={(e) => setNewStep({ ...newStep, role: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <input
                                type="text"
                                value={newStep.description}
                                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                            />
                        </div>
                        <button onClick={handleAddStep}>Add Step</button>
                        <ul>
                            {newProcedure.steps.map((step, index) => (
                                <li key={index}>
                                    <strong>{step.step} ({step.role})</strong>: {step.description}
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleSubmit}>Submit Procedure</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Equipment;
