// AddPointModal.js
import React, { useState } from 'react';
import Modal from './Modal'; // Ensure this path is correct

const AddPointModal = ({ isVisible, hideModal, coordinates, onSubmit }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, id, coordinates });
    setName('');
    setId('');
    hideModal();
  };

  return (
    <Modal
      isVisible={isVisible}
      hideModal={hideModal}
      content={
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label><br />
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          /><br /><br />
          <label htmlFor="id">ID:</label><br />
          <input 
            type="number" 
            id="id" 
            name="id" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            required 
          /><br /><br />
          <button type="submit">Submit</button>
        </form>
      }
    />
  );
};

export default AddPointModal;
