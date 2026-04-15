import React from 'react';
import './HabitCard.css';

const HabitCard = ({ habit, onDelete }) => {
    return (
        <div className="habit-card-item glass-card">
            <div className="habit-top">
                <span className="habit-emoji-big">{habit.icon}</span>
                <button 
                    className="btn-delete-habit" 
                    onClick={() => onDelete(habit.id)}
                    title="Eliminar hábito"
                >
                    🗑️
                </button>
            </div>
            
            <div className="habit-body">
                <h3>{habit.name}</h3>
                <div className="habit-stats">
                    <span className="stat-pill">
                        <span className="icon">🔥</span>
                        {habit.repetition_count || 0} Completado
                    </span>
                    <span className="stat-pill">
                        <span className="icon">📅</span>
                        Día actual
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HabitCard;
