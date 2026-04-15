import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../components/Modal/Modal';
import './Habits.css';

const Habits = () => {
    const { habits, addHabit, updateHabit, deleteHabit, progress } = useContext(AuthContext);
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState('🔥');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [selectedHabit, setSelectedHabit] = useState(null);
    const [editName, setEditName] = useState('');
    const [editIcon, setEditIcon] = useState('');
    const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);

    const addDropdownRef = useRef(null);
    const editDropdownRef = useRef(null);

    const AVAILABLE_ICONS = ['🔥', '🏃‍♂️', '🧘', '💧', '📚', '🍎', '🏋️', '👟', '⚽', '🤸‍♂️', '🌈', '✨', '🔋'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addDropdownRef.current && !addDropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
            if (editDropdownRef.current && !editDropdownRef.current.contains(event.target)) setIsEditDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newName) return;
        addHabit(newName, newIcon);
        setNewName('');
    };

    const handleOpenEdit = (habit) => {
        setSelectedHabit(habit);
        setEditName(habit.name);
        setEditIcon(habit.icon);
    };

    const getHabitStats = (habitId) => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        startOfWeek.setHours(0, 0, 0, 0);

        let allTime = 0, thisMonth = 0, thisWeek = 0;
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        Object.entries(progress).forEach(([dateStr, dayProgress]) => {
            if (dayProgress[habitId]) {
                allTime++;
                const date = new Date(dateStr);
                if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) thisMonth++;
                if (date >= startOfWeek) thisWeek++;
            }
        });
        return { allTime, thisMonth, thisWeek };
    };

    return (
        <div className="habits-container">
            <header className="habits-header">
                <h2>Tus Hábitos 🏆</h2>
                <p>Registra tu consistencia con estadísticas semanales, mensuales y totales.</p>
            </header>

            <form className="add-habit-form glass-card" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input type="text" placeholder="Nombre del hábito..." value={newName} onChange={(e) => setNewName(e.target.value)} />
                    <div className="custom-dropdown" ref={addDropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <div className="dropdown-selected">{newIcon}</div>
                        {isDropdownOpen && (
                            <div className="dropdown-options">
                                {AVAILABLE_ICONS.map(icon => (
                                    <div key={icon} className="dropdown-option" onClick={(e) => { e.stopPropagation(); setNewIcon(icon); setIsDropdownOpen(false); }}>{icon}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit" className="btn-primary">Añadir</button>
                </div>
            </form>

            <div className="habits-grid">
                {habits.map(habit => {
                    const stats = getHabitStats(habit.id);
                    return (
                        <div key={habit.id} className="habit-card glass-card" onClick={() => handleOpenEdit(habit)}>
                            <div className="habit-card-header">
                                <span className="icon">{habit.icon}</span>
                                <h3>{habit.name}</h3>
                            </div>
                            
                            {/* LA LÍNEA ORIGINAL DE ESTADÍSTICAS */}
                            <p className="habit-stats-summary">
                                {stats.thisWeek} completadas esta semana | {stats.thisMonth} este mes | {stats.allTime} totales
                            </p>
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={!!selectedHabit} onClose={() => setSelectedHabit(null)} title="Editar Hábito">
                <form className="edit-habit-form" onSubmit={(e) => { e.preventDefault(); updateHabit(selectedHabit.id, editName, editIcon); setSelectedHabit(null); }}>
                    <div className="form-group"><label>Nombre</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} /></div>
                    <div className="form-group"><label>Icono</label>
                        <div className="custom-dropdown" ref={editDropdownRef} style={{ width: '100%' }} onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}>
                            <div className="dropdown-selected">{editIcon}</div>
                            {isEditDropdownOpen && (<div className="dropdown-options">{AVAILABLE_ICONS.map(icon => (<div key={icon} className="dropdown-option" onClick={(e) => { e.stopPropagation(); setEditIcon(icon); setIsEditDropdownOpen(false); }}>{icon}</div>))}</div>)}
                        </div>
                    </div>
                    <div className="modal-actions"><button type="button" className="btn-danger" onClick={() => { if(window.confirm("¿Eliminar?")) { deleteHabit(selectedHabit.id); setSelectedHabit(null); } }}>Eliminar</button><button type="submit" className="btn-primary">Guardar</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default Habits;
