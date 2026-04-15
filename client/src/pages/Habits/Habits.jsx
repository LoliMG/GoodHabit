import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../components/UI/Modal/Modal';
import HabitCard from '../../components/Habits/HabitCard/HabitCard';
import HabitForm from '../../components/Habits/HabitForm/HabitForm';
import Button from '../../components/UI/Button/Button';
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

    const AVAILABLE_ICONS = [
        '🔥', '🏃', '🧘', '💧', '📚', '🍎', '🏋️', '👟', '⚽', '🤸‍♂️', '🌈', '✨', '🔋',
        '🚴', '🏊', '🏀', '🎾', '🥊', '🧗', '🩺', '🥦', '🥗', '☕', '🍵', '🥛', '🍳',
        '🎨', '🎸', '🎮', '📺', '🎧', '✍️', '🧠', '🕯️', '📓', '⏰', '📅', '✉️', '📎',
        '💻', '💡', '💰', '📈', '🌿', '☀️', '🌑', '🌊', '⛰️', '🧼', '🧹', '🧺'
    ];

    useEffect(() => {
        // Ya no necesitamos handleClickOutside para los iconos ya que no son dropdowns
    }, []);

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

            <div className="add-habit-form glass-card">
                <form onSubmit={(e) => { e.preventDefault(); if (newName) addHabit(newName, newIcon); setNewName(''); }}>
                    <div className="input-group">
                        <input type="text" placeholder="Nombre del hábito..." value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <Button type="submit">Añadir</Button>
                    </div>
                    
                    <div className="icon-selection-container">
                        <label className="section-label">Selecciona un icono</label>
                        <div className="icon-selector-grid">
                            {AVAILABLE_ICONS.map(icon => (
                                <div 
                                    key={icon} 
                                    className={`icon-grid-item ${newIcon === icon ? 'active' : ''}`} 
                                    onClick={() => setNewIcon(icon)}
                                >
                                    {icon}
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div>

            <div className="habits-grid">
                {habits.map(habit => (
                    <HabitCard
                        key={habit.id}
                        habit={habit}
                        stats={getHabitStats(habit.id)}
                        onOpenEdit={handleOpenEdit}
                    />
                ))}
            </div>

            <Modal isOpen={!!selectedHabit} onClose={() => setSelectedHabit(null)} title="Editar Hábito">
                <HabitForm
                    name={editName}
                    setName={setEditName}
                    icon={editIcon}
                    setIcon={setEditIcon}
                    isEdit={true}
                    availableIcons={AVAILABLE_ICONS}
                    isDropdownOpen={isEditDropdownOpen}
                    setIsDropdownOpen={setIsEditDropdownOpen}
                    dropdownRef={editDropdownRef}
                    onSubmit={(e) => { e.preventDefault(); updateHabit(selectedHabit.id, editName, editIcon); setSelectedHabit(null); }}
                    onDelete={() => { if (window.confirm("¿Eliminar?")) { deleteHabit(selectedHabit.id); setSelectedHabit(null); } }}
                />
            </Modal>
        </div>
    );
};

export default Habits;
