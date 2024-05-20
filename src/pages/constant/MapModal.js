import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Ensure this path is correct

const MapModal = ({ isVisible, hideModal, handleSubmit }) => {
  const [points, setPoints] = useState([]);
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');

  useEffect(() => {
    if (isVisible) {
      fetch('http://localhost:8000/get_geojson')
        .then(response => response.json())
        .then(data => {
          // Filter out points that are not of type "Point" and without a Name property or with an empty name
          const validPoints = data.features.filter(point => 
            point.geometry.type === 'Point' && point.properties.Name
          );
          setPoints(validPoints);
        })
        .catch(error => console.error('Error fetching points:', error));
    }
  }, [isVisible]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (startId && endId) {
      handleSubmit(startId, endId);
      hideModal();
    } else {
      alert('Please select both start and end points.');
    }
  };

  return (
    <Modal 
      isVisible={isVisible} 
      hideModal={hideModal} 
      content={
        <form onSubmit={handleFormSubmit}>
          <div>
            <h3>Select Start Point</h3>
            <select 
              value={startId} 
              onChange={(e) => setStartId(parseInt(e.target.value, 10))} 
              required
            >
              <option value="" disabled>Select start point</option>
              {points.map(point => (
                <option key={point.id} value={point.id}>
                  {point.properties.Name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3>Select End Point</h3>
            <select 
              value={endId} 
              onChange={(e) => setEndId(parseInt(e.target.value, 10))} 
              required
            >
              <option value="" disabled>Select end point</option>
              {points.map(point => (
                <option key={point.id} value={point.id}>
                  {point.properties.Name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      } 
    />
  );
};

export default MapModal;
