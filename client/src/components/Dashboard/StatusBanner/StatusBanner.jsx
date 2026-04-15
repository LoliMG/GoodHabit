import React from 'react';
import './StatusBanner.css';

const StatusBanner = ({ dateFormatted, habitsLeftToday }) => {
    return (
        <header className="dashboard-header">
            <div className="status-banner glass-card" style={{ textTransform: 'capitalize' }}>
                <h2>{dateFormatted}</h2>
                <p className="habits-left">
                    {habitsLeftToday > 0
                        ? <span>🚀 <strong>{habitsLeftToday}</strong> hábitos restantes hoy!</span>
                        : <span>🌟 ¡Todo hecho! ¡Lo estás petando!</span>
                    }
                </p>
            </div>
        </header>
    );
};

export default StatusBanner;
