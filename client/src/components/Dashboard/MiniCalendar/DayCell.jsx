import React from 'react';

const DayCell = ({ day, dateStr, status, isToday, moodEmoji, notes, handleDayClick, handleMoodClick, setIsNoteModalOpen, setSelectedDate }) => {
    if (!day) return <div className="day-cell empty"></div>;

    return (
        <div 
            className={`day-cell clickable ${isToday ? 'today' : ''} status-${status}`} 
            onClick={() => handleDayClick(day)}
        >
            <button
                className="day-mood-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    handleMoodClick(dateStr);
                }}
                title="Seleccionar estado de ánimo"
            >
                {moodEmoji ? moodEmoji : <span className="mood-plus-placeholder">+</span>}
            </button>

            <span className="day-number">{day}</span>

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
};

export default DayCell;
