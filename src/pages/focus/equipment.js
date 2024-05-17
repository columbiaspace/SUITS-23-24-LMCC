import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages-style/equipment.css';

const Equipment = () => {
    const [procedures, setProcedures] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProcedureId, setCurrentProcedureId] = useState(null);
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
    const [expandedProcedure, setExpandedProcedure] = useState(null);

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

    const handleStepChange = (index, field, value) => {
        const updatedSteps = newProcedure.steps.map((step, i) => 
            i === index ? { ...step, [field]: value } : step
        );
        setNewProcedure({ ...newProcedure, steps: updatedSteps });
    };

    const handleSubmit = () => {
        const apiCall = isEditing
            ? axios.put(`http://localhost:8000/update_procedure/${currentProcedureId}`, newProcedure)
            : axios.post('http://localhost:8000/add_procedure', newProcedure);

        apiCall
            .then(response => {
                console.log('Procedure saved:', response.data);
                setShowModal(false);
                setIsEditing(false);
                setNewProcedure({
                    id: '',
                    title: '',
                    steps: []
                });
                fetchData();
            })
            .catch(error => {
                console.error('Error saving procedure:', error);
                setError('Error saving procedure');
            });
    };

    const toggleExpand = (id) => {
        setExpandedProcedure(expandedProcedure === id ? null : id);
    };

    const deleteProcedure = (id) => {
        if (window.confirm('Are you sure you want to delete this procedure?')) {
            axios.delete(`http://localhost:8000/delete_procedure/${id}`)
                .then(response => {
                    console.log('Procedure deleted:', response.data);
                    fetchData();  // Refresh the list of procedures
                })
                .catch(error => {
                    console.error('Error deleting procedure:', error);
                    setError('Error deleting procedure');
                });
        }
    };

    const editProcedure = (procedure) => {
        setCurrentProcedureId(procedure.id);
        setNewProcedure(procedure);
        setShowModal(true);
        setIsEditing(true);
    };

    if (error) return <div id="error">Error: {error}</div>;

    return (
        <div id="container">
            <button onClick={() => { setShowModal(true); setIsEditing(false); setNewProcedure({ id: '', title: '', steps: [] }); }}>Add New Procedure</button>
            {procedures.length > 0 ? (
                procedures.map(procedure => (
                    <div key={procedure.id} className="procedure-card" onClick={() => toggleExpand(procedure.id)}>
                        <div className={`procedure-header ${expandedProcedure === procedure.id ? 'expanded' : ''}`}>
                            <h2>{procedure.title}</h2>
                            <h4>ID: {procedure.id}</h4>
                        </div>
                        {expandedProcedure === procedure.id && (
                            <>
                                <ul>
                                    {procedure.steps.map((step, index) => (
                                        <li key={index}>
                                            <strong>{step.step} ({step.role})</strong>: {step.description}
                                        </li>
                                    ))}
                                </ul>
                                <button className="edit-button" onClick={(e) => { e.stopPropagation(); editProcedure(procedure); }}>Edit</button>
                                <button className="delete-button" onClick={(e) => { e.stopPropagation(); deleteProcedure(procedure.id); }}>Delete</button>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <div>No procedures found.</div>
            )}

            {showModal && (
                <div id="modal">
                    <div id="modal-content">
                        <span id="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>{isEditing ? 'Edit Procedure' : 'Add New Procedure'}</h2>
                        <div className="form-group">
                            <label>Procedure ID:</label>
                            <input
                                type="number"
                                value={newProcedure.id}
                                onChange={(e) => setNewProcedure({ ...newProcedure, id: e.target.value })}
                                disabled={isEditing}
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
                        <h3>Steps</h3>
                        {newProcedure.steps.map((step, index) => (
                            <div key={index} className="form-group">
                                <label>Step:</label>
                                <input
                                    type="text"
                                    value={step.step}
                                    onChange={(e) => handleStepChange(index, 'step', e.target.value)}
                                />
                                <label>Role:</label>
                                <input
                                    type="text"
                                    value={step.role}
                                    onChange={(e) => handleStepChange(index, 'role', e.target.value)}
                                />
                                <label>Description:</label>
                                <input
                                    type="text"
                                    value={step.description}
                                    onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                                />
                            </div>
                        ))}
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
                        <button onClick={handleSubmit}>{isEditing ? 'Save Changes' : 'Submit Procedure'}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Equipment;
