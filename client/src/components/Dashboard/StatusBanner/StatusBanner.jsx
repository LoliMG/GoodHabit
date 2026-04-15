import React from 'react';
import './StatusBanner.css';

const StatusBanner = ({ dateFormatted, completedToday }) => {
    return (
        <header className="dashboard-header">
            <div className="status-banner glass-card" style={{ textTransform: 'capitalize' }}>
                <h2>{dateFormatted}</h2>
                <p className="habits-left">
                    <span>🌟 ¡Has completado <strong>{completedToday}</strong> {completedToday === 1 ? 'hábito' : 'hábitos'} hoy!</span>
                </p>
            </div>
        </header>
    );
};

export default StatusBanner;
