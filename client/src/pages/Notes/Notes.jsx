import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../components/Modal/Modal';
import './Notes.css';

const Notes = () => {
    const { notes, updateDayNote, deleteDayNote } = useContext(AuthContext);
    const [searchContent, setSearchContent] = useState('');
    const [searchDate, setSearchDate] = useState('');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Convert notes object to sorted array
    const sortedNotes = Object.entries(notes)
        .map(([date, noteObj]) => ({ date, content: noteObj.content, mood: noteObj.mood }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter by content and date
    const filteredNotes = sortedNotes.filter(note => {
        const matchesContent = (note.content || '').toLowerCase().includes(searchContent.toLowerCase());
        const matchesDate = searchDate ? note.date === searchDate : true;
        return matchesContent && matchesDate;
    });

    const handleOpenCreate = () => {
        const today = new Date().toISOString().split('T')[0];
        setModalDate(today);
        setModalContent('');
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (note) => {
        setModalDate(note.date);
        setModalContent(note.content || '');
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (date) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            await deleteDayNote(date);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!modalDate || !modalContent) return;
        
        const existingNote = notes[modalDate] || {};
        const res = await updateDayNote(modalDate, modalContent, existingNote.mood);
        if (res.success) {
            setIsModalOpen(false);
        }
    };

    return (
        <div className="notes-page-container">
            <header className="notes-header">
                <h2 className="animate-fade-in">Tu Historial de <span className="gradient-text">Reflexiones</span> 📝</h2>
                <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>Repasa tus pensamientos y progreso a lo largo del tiempo.</p>
                <div className="header-actions animate-fade-in" style={{ animationDelay: '0.15s' }}>
                    <button className="btn-primary" onClick={handleOpenCreate}>+ Crear Nueva Nota</button>
                </div>
            </header>

            <div className="notes-controls glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="search-group content-search">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Buscar por contenido..." 
                        value={searchContent}
                        onChange={(e) => setSearchContent(e.target.value)}
                    />
                </div>
                <div className="search-group date-search">
                    <span className="search-icon">📅</span>
                    <input 
                        type="date" 
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                    {searchDate && (
                        <button className="clear-date" onClick={() => setSearchDate('')}>✕</button>
                    )}
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
                                <div className="date-mood-row">
                                    <span className="note-date">
                                        {new Date(note.date).toLocaleDateString('es-ES', { 
                                            weekday: 'long', 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}
                                    </span>
                                    {note.mood && <span className="note-mood-emoji">{note.mood}</span>}
                                </div>
                                <div className="note-actions">
                                    <button className="btn-note-edit" onClick={() => handleOpenEdit(note)}>✏️</button>
                                    <button className="btn-note-delete" onClick={() => handleDelete(note.date)}>🗑️</button>
                                </div>
                            </div>
                            <div className="note-content">
                                {note.content}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? "Editar Nota" : "Crear Nueva Nota"}
                maxWidth="600px"
            >
                <form className="note-modal-form" onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Fecha</label>
                        <input 
                            type="date" 
                            value={modalDate} 
                            onChange={(e) => setModalDate(e.target.value)}
                            disabled={isEditing}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Tu reflexión</label>
                        <textarea 
                            value={modalContent} 
                            onChange={(e) => setModalContent(e.target.value)}
                            placeholder="¿Qué tienes en mente hoy?"
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="btn-primary">Guardar Nota</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Notes;
