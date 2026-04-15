import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../components/Modal/Modal';
import StatusBanner from '../../components/Dashboard/StatusBanner/StatusBanner';
import MiniCalendar from '../../components/Dashboard/MiniCalendar/MiniCalendar';
import DailyPlan from '../../components/Dashboard/DailyPlan/DailyPlan';
import DailyNote from '../../components/Dashboard/DailyNote/DailyNote';
import MoodSelector from '../../components/Dashboard/MoodSelector/MoodSelector';
import MobileSelector from '../../components/Dashboard/MobileSelector/MobileSelector';

import './Dashboard.css';

const Dashboard = () => {
    const { 
        habits, oneTimeHabits, addOneTimeHabit, deleteOneTimeHabit, 
        progress, toggleHabitProgress, notes, updateDayNote, 
        updateDayMood, deleteDayNote, moods 
    } = useContext(AuthContext);

    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
    const [isSelectorModalOpen, setIsSelectorModalOpen] = useState(false);
    const [otName, setOtName] = useState("");
    const [currentNote, setCurrentNote] = useState("");
    const [currentMood, setCurrentMood] = useState("");

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const dateFormatted = today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    useEffect(() => {
        if (selectedDate) {
            setCurrentNote(notes[selectedDate]?.content || "");
            setCurrentMood(moods[selectedDate] || "");
        }
    }, [selectedDate, notes, moods]);

    const getHabitsForDay = (dateStr) => [...habits, ...(oneTimeHabits[dateStr] || [])];
    const getCompletedCount = (dateStr) => {
        const dayHabits = getHabitsForDay(dateStr);
        const dayProgress = progress[dateStr] || {};
        return dayHabits.filter(h => h.isOneTime ? h.isCompleted : dayProgress[h.id]).length;
    };

    const getDayStatus = (dateStr) => {
        const dayHabits = getHabitsForDay(dateStr);
        if (dayHabits.length === 0) return 'none';
        const completed = getCompletedCount(dateStr);
        const total = dayHabits.length;
        if (completed === 0) return 'none';
        if (completed === total) return 'full';
        return completed >= total / 2 ? 'majority' : 'partial';
    };

    const completedToday = getCompletedCount(todayStr);

    const changeMonth = (offset) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + offset);
        setViewDate(newDate);
    };

    const handleDayClick = (day) => {
        const formattedDate = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        setSelectedDate(formattedDate);
        if (window.innerWidth <= 768) setIsSelectorModalOpen(true);
        else setIsModalOpen(true);
    };

    const handleAddOT = (e) => {
        e.preventDefault();
        if (!otName) return;
        addOneTimeHabit(selectedDate, otName);
        setOtName("");
    };

    // Calendar Cells Calculation
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const firstDayOfMonth = (firstDay + 6) % 7;
    const numDays = getDaysInMonth(viewDate.getMonth(), viewDate.getFullYear());
    const calendarCells = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
    for (let i = 1; i <= numDays; i++) calendarCells.push(i);

    return (
        <div className="dashboard-container">
            <StatusBanner 
                dateFormatted={dateFormatted} 
                completedToday={completedToday} 
            />

            <MiniCalendar 
                viewDate={viewDate}
                changeMonth={changeMonth}
                calendarCells={calendarCells}
                today={today}
                currentYear={viewDate.getFullYear()}
                moods={moods}
                notes={notes}
                getDayStatus={getDayStatus}
                handleDayClick={handleDayClick}
                handleMoodClick={(date) => { setSelectedDate(date); setIsMoodModalOpen(true); }}
                setIsNoteModalOpen={setIsNoteModalOpen}
                setSelectedDate={setSelectedDate}
            />

            {/* Modals */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tu plan para hoy">
                <DailyPlan 
                    habits={getHabitsForDay(selectedDate).map(h => ({
                        ...h,
                        isDone: h.isOneTime ? h.isCompleted : progress[selectedDate]?.[h.id]
                    }))}
                    allGlobalHabits={habits}
                    otName={otName}
                    setOtName={setOtName}
                    onAddOT={handleAddOT}
                    onToggle={(id, isOT) => toggleHabitProgress(selectedDate, id, isOT)}
                    onDeleteOT={(id) => deleteOneTimeHabit(selectedDate, id)}
                />
            </Modal>

            <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Diario del Día" maxWidth="720px">
                <DailyNote 
                    currentNote={currentNote}
                    setCurrentNote={setCurrentNote}
                    onSave={() => updateDayNote(selectedDate, currentNote).then(() => setIsNoteModalOpen(false))}
                    onDelete={() => deleteDayNote(selectedDate).then(() => { setCurrentNote(""); setIsNoteModalOpen(false); })}
                    hasNote={!!notes[selectedDate]?.content}
                />
            </Modal>

            <Modal isOpen={isMoodModalOpen} onClose={() => setIsMoodModalOpen(false)} title="¿Cómo te sientes?" maxWidth="550px">
                <MoodSelector 
                    currentMood={currentMood}
                    onSelect={(emoji) => { updateDayMood(selectedDate, emoji); setIsMoodModalOpen(false); }}
                />
            </Modal>

            <Modal isOpen={isSelectorModalOpen} onClose={() => setIsSelectorModalOpen(false)} title="¿Qué quieres hacer?" maxWidth="400px">
                <MobileSelector 
                    onSelectAction={(action) => {
                        setIsSelectorModalOpen(false);
                        if (action === 'habits') setIsModalOpen(true);
                        if (action === 'mood') setIsMoodModalOpen(true);
                        if (action === 'note') setIsNoteModalOpen(true);
                    }}
                />
            </Modal>
        </div>
    );
};

export default Dashboard;
