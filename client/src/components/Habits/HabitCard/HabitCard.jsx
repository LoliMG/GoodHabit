import React from 'react';
import './HabitCard.css';

const HabitCard = ({ habit, onDelete }) => {
    return (
        <div className="habit-card glass-card">
            <div className="card-top">
                <span className="habit-icon">{habit.icon}</span>
                <button 
                    className="btn-delete" 
                    onClick={() => onDelete(habit.id)}
                    title="Borrar hábito"
                >
                    🗑️
                </button>
            </div>
            <div className="card-body">
                <h3>{habit.name}</h3>
            </div>
            <div className="card-footer">
                <span className="habit-badge">Activo</span>
            </div>
        </div>
    );
};

export default HabitCard;
