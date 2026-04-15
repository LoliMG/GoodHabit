import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import NotesDateSelector from '../../components/Notes/NotesDateSelector/NotesDateSelector';
import NotesEditor from '../../components/Notes/NotesEditor/NotesEditor';
import './Notes.css';

const Notes = () => {
    const { notes, updateDayNote, deleteDayNote } = useContext(AuthContext);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentNote, setCurrentNote] = useState("");

    const dateStr = selectedDate.toISOString().split('T')[0];

    useEffect(() => {
        setCurrentNote(notes[dateStr]?.content || "");
    }, [dateStr, notes]);

    const handleSave = () => {
        updateDayNote(dateStr, currentNote);
    };

    const handleDelete = () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta entrada?")) {
            deleteDayNote(dateStr).then(() => setCurrentNote(""));
        }
    };

    return (
        <div className="notes-page-container">
            <header className="notes-header">
                <h1 className="notes-title">Tu <span className="gradient-text">Diario</span> Personal</h1>
                <p className="subtitle">Documenta tu viaje hacia el éxito una nota a la vez.</p>
            </header>

            <main className="notes-immersive-area">
                <div className="notes-controls-top">
                    <NotesDateSelector 
                        selectedDate={selectedDate} 
                        setSelectedDate={setSelectedDate} 
                    />
                </div>
                
                <div className="notes-editor-wrapper">
                    <NotesEditor 
                        selectedDate={selectedDate}
                        currentNote={currentNote}
                        setCurrentNote={setCurrentNote}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        hasNote={!!notes[dateStr]?.content}
                    />
                </div>
            </main>
        </div>
    );
};

export default Notes;
