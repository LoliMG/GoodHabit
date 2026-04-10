import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Notes.css';

const Notes = () => {
    const { notes } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');

    // Convert notes object to sorted array
    const sortedNotes = Object.entries(notes)
        .map(([date, content]) => ({ date, content }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter by date or content
    const filteredNotes = sortedNotes.filter(note => 
        note.date.includes(searchTerm) || note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="notes-page-container">
            <header className="notes-header">
                <h2 className="animate-fade-in">Tu Historial de <span className="gradient-text">Reflexiones</span> 📝</h2>
                <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>Repasa tus pensamientos y progreso a lo largo del tiempo.</p>
            </header>

            <div className="notes-controls glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="search-group">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Filtrar por fecha (YYYY-MM-DD) o contenido..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="notes-grid">
                {filteredNotes.length === 0 ? (
                    <div className="no-notes glass-card animate-fade-in">
                        <p>No se encontraron notas con ese criterio.</p>
                    </div>
                ) : (
                    filteredNotes.map((note, idx) => (
                        <div 
                            key={note.date} 
                            className="note-card glass-card animate-fade-in" 
                            style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
                        >
                            <div className="note-card-header">
                                <span className="note-date">
                                    {new Date(note.date).toLocaleDateString('es-ES', { 
                                        weekday: 'long', 
                                        day: 'numeric', 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })}
                                </span>
                            </div>
                            <div className="note-content">
                                {note.content}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notes;
