import React from 'react';
import Modal from './Modal'; // Ensure this path is correct

const MapModal = ({ isVisible, hideModal, handleSubmit }) => {
  return (
    <Modal 
      isVisible={isVisible} 
      hideModal={hideModal} 
      content={
        <form onSubmit={handleSubmit}>
          <label htmlFor="start_id">Start ID:</label><br />
          <input type="number" id="start_id" name="start_id" required /><br /><br />
          <label htmlFor="end_id">End ID:</label><br />
          <input type="number" id="end_id" name="end_id" required /><br /><br />
          <button type="submit">Submit</button>
        </form>
      } 
    />
  );
};

export default MapModal;
