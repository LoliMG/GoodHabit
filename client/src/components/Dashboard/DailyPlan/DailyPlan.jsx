import React, { useState } from 'react';
import './DailyPlan.css';

const DailyPlan = ({ habits, allGlobalHabits, otName, setOtName, onAddOT, onToggle, onDeleteOT }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Mostramos los hábitos completados Y todas las tareas únicas (aunque no estén hechas)
    const visibleHabits = habits.filter(h => h.isDone || h.isOneTime);

    // Filtramos para el select: hábitos globales que NO están en la lista de completados
    const availableGlobalHabits = allGlobalHabits.filter(gh => 
        !visibleHabits.some(ch => !ch.isOneTime && ch.id === gh.id)
    );

    const handleSelectHabit = (id) => {
        onToggle(id, false);
        setIsDropdownOpen(false);
    };

    return (
        <div className="daily-context">
            {/* Nuevo Custom Selector de Hábitos Globales */}
            <div className="custom-dropdown-container">
                <label className="dropdown-label">¿QUÉ HAS HECHO HOY?</label>
                <div className={`custom-dropdown ${isDropdownOpen ? 'active' : ''}`}>
                    <div className="dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <span className="placeholder">
                            {isDropdownOpen ? 'Elegir hábito...' : 'Añadir un hábito...'}
                        </span>
                        <span className="arrow">▼</span>
                    </div>

                    {isDropdownOpen && (
                        <div className="dropdown-options glass-card">
                            {availableGlobalHabits.length > 0 ? (
                                availableGlobalHabits.map(gh => (
                                    <div 
                                        key={gh.id} 
                                        className="option-item"
                                        onClick={() => handleSelectHabit(gh.id)}
                                    >
                                        <span className="icon">{gh.icon}</span>
                                        <span className="name">{gh.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-options">Ya has completado todos tus hábitos ✨</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <form className="ot-input-group" onSubmit={onAddOT}>
                <input type="text" placeholder="Añadir tarea única..." value={otName} onChange={(e) => setOtName(e.target.value)} />
                <button type="submit" className="btn-add-ot">+</button>
            </form>

            <div className="habits-list">
                {visibleHabits.length === 0 && <p className="no-habits">Aún no hay actividad registrada.</p>}
                
                {visibleHabits.map(habit => (
                    <div 
                        key={habit.isOneTime ? `ot-${habit.id}` : `reg-${habit.id}`} 
                        className={`habit-item glass-card ${habit.isOneTime ? 'one-time' : ''}`} 
                        onClick={() => onToggle(habit.id, habit.isOneTime)}
                    >
                        <span className="habit-icon">{habit.icon}</span>
                        <div className="habit-info">
                            <span className="habit-name">{habit.name}</span>
                            {habit.isOneTime && <span className="ot-badge">Tarea única</span>}
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
