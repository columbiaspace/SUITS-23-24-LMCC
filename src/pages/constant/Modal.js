import React from 'react';
import './constant.css';

const Modal = ({ isVisible, hideModal, content }) => {
  if (!isVisible) return null;

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <span className="close" onClick={hideModal}>&times;</span>
        {content}
      </div>
    </div>
  );
};

export default Modal;
