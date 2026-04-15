import React from 'react';
import './HabitForm.css';

const HabitForm = ({ habit, setHabit, onSave }) => {
    const icons = ['🏃', '🧘', '💧', '🥗', '📚', '🛌', '🚭', '🍎', '💻', '🎨', '🚀', '🧠', '🎹', '🍵', '🚿'];

    return (
        <div className="habit-form-container">
            <div className="form-group">
                <label>Nombre del Hábito</label>
                <input 
                    type="text" 
                    placeholder="Ej: Meditar 10 min..." 
                    value={habit.name} 
                    onChange={(e) => setHabit({ ...habit, name: e.target.value })} 
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Elige un Icono</label>
                <div className="icon-selector-grid">
                    {icons.map(icon => (
                        <button 
                            key={icon} 
                            className={`icon-btn ${habit.icon === icon ? 'active' : ''}`} 
                            onClick={() => setHabit({ ...habit, icon })}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            <button className="btn-save-habit" onClick={onSave} disabled={!habit.name || !habit.icon}>
                Confirmar y Guardar
            </button>
        </div>
    );
};

export default HabitForm;
