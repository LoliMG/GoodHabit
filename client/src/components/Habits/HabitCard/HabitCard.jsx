import React from 'react';
import './HabitCard.css';

const HabitCard = ({ habit, onDelete }) => {
    // Simulamos los datos históricos para que se vea el diseño (|)
    const weekCount = habit.repetition_count || 0; // Aquí iría la lógica de semana
    const monthCount = habit.repetition_count || 0; // Aquí iría la lógica de mes
    const totalCount = habit.repetition_count || 0;

    return (
        <div className="habit-card-item glass-card">
            <button 
                className="btn-delete-habit" 
                onClick={() => onDelete(habit.id)}
                title="Eliminar hábito"
            >
                🗑️
            </button>
            
            <div className="habit-content-wrapper">
                <span className="habit-icon-main">{habit.icon}</span>
                <h3 className="habit-name-title">{habit.name}</h3>
                
                <div className="habit-stats-minimal">
                    <span className="stat-value">{weekCount} esta semana</span>
                    <span className="divider">|</span>
                    <span className="stat-value">{monthCount} este mes</span>
                    <span className="divider">|</span>
                    <span className="stat-value">{totalCount} totales</span>
                </div>
            </div>
        </div>
    );
};

export default HabitCard;
