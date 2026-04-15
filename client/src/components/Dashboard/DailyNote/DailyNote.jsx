import React from 'react';
import './DailyNote.css';

const DailyNote = ({ currentNote, setCurrentNote, onSave, onDelete, hasNote }) => {
    return (
        <div className="daily-note-section glass-card" style={{ marginTop: 0 }}>
            <textarea
                className="note-textarea"
                placeholder="Escribe una pequeña reflexión..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
            />
            <div className="note-actions">
                {hasNote && (
                    <button
                        className="btn-delete-note"
                        onClick={onDelete}
                    >
                        Eliminar
                    </button>
                )}
                <button
                    className="btn-save-note"
                    onClick={onSave}
                >
                    Guardar Nota
                </button>
            </div>
        </div>
    );
};

export default DailyNote;
