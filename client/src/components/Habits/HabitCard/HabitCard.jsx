import React from 'react';
import './HabitCard.css';

const HabitCard = ({ habit, onDelete }) => {
    // Cálculo de éxito (simulado si no viene del backend aún)
    const successRate = 100; // Podríamos calcularlo con habit.repetition_count / algo

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
                
                <div className="habit-stats-row">
                    <div className="stat-box">
                        <span className="stat-value">{habit.repetition_count || 0}</span>
                        <span className="stat-label">🔥 Total</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">5</span>
                        <span className="stat-label">⚡ Racha</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">{successRate}%</span>
                        <span className="stat-label">📈 Éxito</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabitCard;
