import React from 'react';
import './NotesEditor.css';

const NotesEditor = ({ selectedDate, currentNote, setCurrentNote, onSave, onDelete, hasNote }) => {
    const formattedDate = new Date(selectedDate).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="diary-card glass-card">
            <header className="diary-header">
                <div className="diary-info">
                    <span className="status-badge">
                        <span className={`dot ${hasNote ? 'active' : ''}`}></span>
                        {hasNote ? 'Guardado' : 'Borrador'}
                    </span>
                    <h2 className="current-date-title">{formattedDate}</h2>
                </div>
                {hasNote && (
                    <button className="btn-delete-note" onClick={onDelete} title="Eliminar entrada">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                )}
            </header>

            <div className="editor-main">
                <textarea
                    className="diary-textarea"
                    placeholder="Escribe tus pensamientos del día aquí..."
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                />
            </div>

            <footer className="diary-footer">
                <div className="footer-info">
                    <p className="char-count">{currentNote?.length || 0} caracteres</p>
                </div>
                <button className="btn-save-premium" onClick={onSave}>
                    <span>Guardar Entrada</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                </button>
            </footer>
        </div>
    );
};

export default NotesEditor;
