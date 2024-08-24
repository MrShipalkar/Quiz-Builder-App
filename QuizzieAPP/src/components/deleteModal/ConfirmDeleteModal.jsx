import React from 'react';
import './ConfirmDeleteModal.css';

function ConfirmDeleteModal({ show, onClose, onConfirm }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you confirm you want to delete ?</h3>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>Confirm Delete</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
