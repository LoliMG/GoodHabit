import React from 'react';
import DayCell from './DayCell';
import './MiniCalendar.css';

const MiniCalendar = ({ 
    viewDate, 
    changeMonth, 
    calendarCells, 
    today, 
    currentYear, 
    moods, 
    notes, 
    getDayStatus, 
    handleDayClick, 
    handleMoodClick, 
    setIsNoteModalOpen, 
    setSelectedDate 
}) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const currentMonthLabel = viewDate.toLocaleString('es-ES', { month: 'long' });

    return (
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
                    const dateStr = day ? `${currentYear}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : null;
                    const status = dateStr ? getDayStatus(dateStr) : 'none';
                    const isToday = day === today.getDate() && viewDate.getMonth() === today.getMonth() && currentYear === today.getFullYear();
                    const moodEmoji = dateStr ? moods[dateStr] : null;

                    return (
                        <DayCell 
                            key={day ? `day-${day}` : `empty-${idx}`} 
                            day={day}
                            dateStr={dateStr}
                            status={status}
                            isToday={isToday}
                            moodEmoji={moodEmoji}
                            notes={notes}
                            handleDayClick={handleDayClick}
                            handleMoodClick={handleMoodClick}
                            setIsNoteModalOpen={setIsNoteModalOpen}
                            setSelectedDate={setSelectedDate}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default MiniCalendar;
