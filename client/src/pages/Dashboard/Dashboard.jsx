import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../components/Modal/Modal';
import './Dashboard.css';

const Dashboard = () => {
    const { habits, oneTimeHabits, addOneTimeHabit, deleteOneTimeHabit, progress, toggleHabitProgress, notes, updateDayNote, updateDayMood, deleteDayNote } = useContext(AuthContext);
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [otName, setOtName] = useState("");
    const [currentNote, setCurrentNote] = useState("");
    const [currentMood, setCurrentMood] = useState("");

    React.useEffect(() => {
        if (selectedDate) {
            const noteObj = notes[selectedDate] || {};
            setCurrentNote(noteObj.content || "");
            setCurrentMood(noteObj.mood || "");
        }
    }, [selectedDate, notes]);

    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const localeString = 'es-ES';

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    const currentMonthLabel = viewDate.toLocaleString(localeString, { month: 'long' });
    const currentYear = viewDate.getFullYear();

    const getHabitsForDay = (dateStr) => {
        return [...habits, ...(oneTimeHabits[dateStr] || [])];
    };

    const getCompletedCount = (dateStr) => {
        const dayHabits = getHabitsForDay(dateStr);
        const dayProgress = progress[dateStr] || {};
        return dayHabits.filter(h => h.isOneTime ? h.isCompleted : dayProgress[h.id]).length;
    };

    const habitsLeftToday = getHabitsForDay(todayStr).length - getCompletedCount(todayStr);
    const dateFormatted = today.toLocaleDateString(localeString, { weekday: 'long', day: 'numeric', month: 'long' });

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const firstDayOfMonth = (firstDay + 6) % 7;

    const numDays = getDaysInMonth(viewDate.getMonth(), currentYear);
    const calendarCells = [];

    for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
    for (let i = 1; i <= numDays; i++) calendarCells.push(i);

    const changeMonth = (offset) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + offset);
        setViewDate(newDate);
    };

    const handleDayClick = (day) => {
        if (!day) return;
        const formattedDate = `${currentYear}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        setSelectedDate(formattedDate);
        setIsModalOpen(true);
    };

    const handleAddOT = (e) => {
        e.preventDefault();
        if (!otName) return;
        addOneTimeHabit(selectedDate, otName);
        setOtName("");
    };

    const getDayStatus = (dateStr) => {
        const dayHabits = getHabitsForDay(dateStr);
        if (dayHabits.length === 0) return 'none';

        const completed = getCompletedCount(dateStr);
        const total = dayHabits.length;

        if (completed === 0) return 'none';
        if (completed === total) return 'full';
        return 'partial';
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="status-banner glass-card" style={{ textTransform: 'capitalize' }}>
                    <h2>{dateFormatted}</h2>
                    <p className="habits-left">
                        {habitsLeftToday > 0
                            ? <span>🚀 <strong>{habitsLeftToday}</strong> hábitos restantes hoy!</span>
                            : <span>🌟 ¡Todo hecho! ¡Lo estás petando!</span>
                        }
                    </p>
                </div>
            </header>

            <div className="calendar-card mini-calendar glass-card">
                <div className="calendar-header">
                    <h3 style={{ textTransform: 'capitalize' }}>{currentMonthLabel} {currentYear}</h3>
                    <div className="cal-nav">
                        <button onClick={() => changeMonth(-1)}>‹</button>
                        <button onClick={() => changeMonth(1)}>›</button>
                    </div>
                </div>
                <div className="calendar-grid">
                    {days.map((d, i) => {
                        const dayIndex = (i + 1) % 7;
                        return <div key={i} className="day-name">{days[dayIndex]}</div>;
                    })}
                    {calendarCells.map((day, idx) => {
                        if (!day) return <div key={`empty-${idx}`} className={`day-cell empty`}></div>;
                        const dateStr = `${currentYear}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        const status = getDayStatus(dateStr);
                        const isToday = day === today.getDate() && viewDate.getMonth() === today.getMonth() && currentYear === today.getFullYear();

                        const moodEmoji = notes[dateStr]?.mood;

                        return (
                            <div key={day} className={`day-cell clickable ${isToday ? 'today' : ''} status-${status}`} onClick={() => handleDayClick(day)}>
                                <span>{day}</span>
                                {moodEmoji && <div className="day-mood-indicator">{moodEmoji}</div>}
                                <div
                                    className="day-card-note-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDate(dateStr);
                                        setIsNoteModalOpen(true);
                                    }}
                                >
                                    {notes[dateStr]?.content ? '📝' : '+'}
                                </div>
                                {status !== 'none' && <div className="day-indicator"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    <div>
                        Tu plan para hoy
                        <div style={{ fontSize: '1rem', opacity: 0.5, marginTop: '0.5rem', fontWeight: 400 }}>{selectedDate}</div>
                    </div>
                }
            >
                <div className="daily-context">
                    <form className="ot-input-group" onSubmit={handleAddOT}>
                        <input type="text" placeholder="Añadir tarea única..." value={otName} onChange={(e) => setOtName(e.target.value)} />
                        <button type="submit" className="btn-add-ot">+</button>
                    </form>

                    <div className="habits-list">
                        {getHabitsForDay(selectedDate).length === 0 && <p className="no-habits">No hay hábitos registrados para hoy.</p>}
                        {getHabitsForDay(selectedDate).map(habit => {
                            const isDone = habit.isOneTime ? habit.isCompleted : progress[selectedDate]?.[habit.id];
                            return (
                                <div key={habit.isOneTime ? `ot-${habit.id}` : `reg-${habit.id}`} className={`habit-item glass-card ${habit.isOneTime ? 'one-time' : ''}`} onClick={() => toggleHabitProgress(selectedDate, habit.id, habit.isOneTime)}>
                                    <span className="habit-icon">{habit.icon}</span>
                                    <div className="habit-info">
                                        <span className="habit-name">{habit.name}</span>
                                        {habit.isOneTime && <span className="ot-badge">Una vez</span>}
                                    </div>
                                    <div className="habit-actions">
                                        <div className={`checkbox ${isDone ? 'checked' : ''}`}>{isDone && '✓'}</div>
                                        {habit.isOneTime && (
                                            <button 
                                                className="btn-delete-ot" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if(window.confirm('¿Borrar tarea?')) deleteOneTimeHabit(selectedDate, habit.id);
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
                maxWidth="720px"
                title={
                    <div>
                        Diario del Día
                        <div style={{ fontSize: '1rem', opacity: 0.5, marginTop: '0.5rem', fontWeight: 400 }}>{selectedDate}</div>
                    </div>
                }
            >
                <div className="daily-note-section glass-card" style={{ marginTop: 0 }}>
                    <div className="mood-picker">
                        <span className="mood-label">¿Cómo te sientes hoy?</span>
                        <div className="mood-emojis">
                            {['😊', '🤩', '😐', '😔', '😫', '😡'].map(emoji => (
                                <button 
                                    key={emoji} 
                                    className={`mood-btn ${currentMood === emoji ? 'active' : ''}`}
                                    onClick={() => setCurrentMood(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                    <textarea
                        className="note-textarea"
                        placeholder="Escribe una pequeña reflexión..."
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        {notes[selectedDate]?.content && (
                            <button
                                className="btn-save-note"
                                style={{ background: 'hsla(0,84%,60%,0.15)', color: '#ff4757', border: '1px solid hsla(0,84%,60%,0.3)' }}
                                onClick={async () => {
                                    if(window.confirm('¿Borrar nota?')) {
                                        const res = await deleteDayNote(selectedDate);
                                        if (res.success) {
                                            setCurrentNote("");
                                            setIsNoteModalOpen(false);
                                        }
                                    }
                                }}
                            >
                                Eliminar
                            </button>
                        )}
                        <button
                            className="btn-save-note"
                            onClick={async () => {
                                const res = await updateDayNote(selectedDate, currentNote, currentMood);
                                if (res.success) setIsNoteModalOpen(false);
                            }}
                        >
                            Guardar Nota
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
