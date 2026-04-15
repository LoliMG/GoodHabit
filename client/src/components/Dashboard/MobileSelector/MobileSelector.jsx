import React from 'react';
import './MobileSelector.css';

const MobileSelector = ({ onSelectAction }) => {
    const actions = [
        { id: 'habits', icon: '✨', label: 'Hábitos' },
        { id: 'mood', icon: '😊', label: 'Estado de ánimo' },
        { id: 'note', icon: '📝', label: 'Nota del día' }
    ];

    return (
        <div className="mobile-selector-grid">
            {actions.map(action => (
                <button 
                    key={action.id} 
                    className="selector-btn glass-card" 
                    onClick={() => onSelectAction(action.id)}
                >
                    <span className="icon">{action.icon}</span>
                    <span className="label">{action.label}</span>
                </button>
            ))}
        </div>
    );
};

export default MobileSelector;
