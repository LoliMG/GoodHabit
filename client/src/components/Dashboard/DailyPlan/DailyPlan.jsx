import React, { useState } from 'react';
import './DailyPlan.css';

const DailyPlan = ({ habits, allGlobalHabits, otName, setOtName, onAddOT, onToggle, onDeleteOT }) => {
    // Solo mostramos los que están completados o son OneTime
    const completedHabits = habits.filter(h => h.isDone);

    // Filtramos para el select: hábitos globales que NO están en la lista de completados
    const availableGlobalHabits = allGlobalHabits.filter(gh => 
        !completedHabits.some(ch => !ch.isOneTime && ch.id === gh.id)
    );

    return (
        <div className="daily-context">
            {/* Nuevo Selector de Hábitos Globales */}
            <div className="habit-selector-group">
                <label>¿Qué has hecho hoy?</label>
                <div className="custom-select-wrapper">
                    <select 
                        value="" 
                        onChange={(e) => {
                            if (e.target.value) onToggle(Number(e.target.value), false);
                        }}
                    >
                        <option value="" disabled>Añadir un hábito...</option>
                        {availableGlobalHabits.map(gh => (
                            <option key={gh.id} value={gh.id}>
                                {gh.icon} {gh.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <form className="ot-input-group" onSubmit={onAddOT}>
                <input type="text" placeholder="Añadir tarea única (ej: Ir al médico)" value={otName} onChange={(e) => setOtName(e.target.value)} />
                <button type="submit" className="btn-add-ot">+</button>
            </form>

            <div className="habits-list">
                {completedHabits.length === 0 && <p className="no-habits">Aún no has registrado actividad para este día.</p>}
                
                {completedHabits.map(habit => (
                    <div 
                        key={habit.isOneTime ? `ot-${habit.id}` : `reg-${habit.id}`} 
                        className={`habit-item glass-card ${habit.isOneTime ? 'one-time' : ''}`} 
                        onClick={() => onToggle(habit.id, habit.isOneTime)}
                    >
                        <span className="habit-icon">{habit.icon}</span>
                        <div className="habit-info">
                            <span className="habit-name">{habit.name}</span>
                            {habit.isOneTime && <span className="ot-badge">Una vez</span>}
                        </div>
                        <div className="habit-actions">
                            <div className={`checkbox ${habit.isDone ? 'checked' : ''}`}>{habit.isDone && '✓'}</div>
                            {habit.isOneTime && (
                                <button
                                    className="btn-delete-ot"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteOT(habit.id);
                                    }}
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyPlan;
