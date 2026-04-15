import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, maxWidth }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card" style={maxWidth ? { maxWidth } : {}} onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{title}</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </header>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
