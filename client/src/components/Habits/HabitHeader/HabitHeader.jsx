import React from 'react';
import './HabitHeader.css';

const HabitHeader = ({ onAddClick }) => {
    return (
        <header className="habits-header">
            <div className="header-info">
                <h1>Tus <span className="gradient-text">Hábitos</span></h1>
                <p>Construye la disciplina día a día.</p>
            </div>
            <button className="btn-add-habit" onClick={onAddClick}>
                <span className="plus-icon">+</span>
                <span>Crear Hábito</span>
            </button>
        </header>
    );
};

export default HabitHeader;
