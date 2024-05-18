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
    const [sentProcedureId, setSentProcedureId] = useState(null);

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

    const fetchSentProcedureId = () => {
        axios.get('http://localhost:8000/get_sent_procedure')
            .then(response => {
                console.log('Sent Procedure ID:', response.data.id); // Debugging: Log the sent procedure ID
                setSentProcedureId(response.data.id);
            })
            .catch(error => {
                console.error('Error fetching sent procedure ID:', error);
                setError('Error fetching sent procedure ID');
            });
    };

    useEffect(() => {
        fetchData();  // Fetch initially
        fetchSentProcedureId();  // Fetch the sent procedure ID initially

        const interval = setInterval(() => {
            fetchData();
            fetchSentProcedureId();
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
                // If editing and the procedure is the currently sent one, resend it
                if (isEditing && currentProcedureId === sentProcedureId) {
                    sendProcedure(currentProcedureId);
                }
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

    const sendProcedure = (id) => {
        axios.post(`http://localhost:8000/send_procedure?id=${id}`)
            .then(response => {
                console.log('Procedure sent:', response.data);
                fetchSentProcedureId();  // Refresh the sent procedure ID
            })
            .catch(error => {
                console.error('Error sending procedure:', error);
                setError('Error sending procedure');
            });
    };

    if (error) return <div id="error">Error: {error}</div>;

    return (
        <div id="container">
            {procedures.length > 0 ? (
                procedures.map(procedure => {
                    const isHighlighted = procedure.id === sentProcedureId;
                    console.log(`Procedure ID: ${procedure.id}, Highlighted: ${isHighlighted}`); // Debugging
                    return (
                        <div key={procedure.id} id={isHighlighted ? 'highlight' : undefined} className="procedure-card" onClick={() => toggleExpand(procedure.id)}>
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
                                    <button className="send-button" onClick={(e) => { e.stopPropagation(); sendProcedure(procedure.id); }}>Send</button>
                                </>
                            )}
                        </div>
                    );
                })
            ) : (
                <div>No procedures found.</div>
            )}
            <button onClick={() => { setShowModal(true); setIsEditing(false); setNewProcedure({ id: '', title: '', steps: [] }); }}>Add New Procedure</button>
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
