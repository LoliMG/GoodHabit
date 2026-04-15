import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import './NotesDateSelector.css';

registerLocale('es', es);

const NotesDateSelector = ({ selectedDate, setSelectedDate }) => {
    return (
        <div className="notes-sidebar glass-card">
            <h3 className="sidebar-title">Calendario</h3>
            <div className="datepicker-container">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    inline
                    locale="es"
                    calendarClassName="premium-datepicker"
                />
            </div>
            <div className="sidebar-hint">
                <p>Haz clic en un día para escribir o editar tu diario.</p>
            </div>
        </div>
    );
};

export default NotesDateSelector;
