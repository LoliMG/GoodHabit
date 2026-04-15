import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchData } from '../../helpers/axiosHelper';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import CustomDatePicker from '../../components/UI/DatePicker/CustomDatePicker';
import './Notes.css';

const NotesPage = () => {
    const { user, token, notes, deleteDayNote, updateDayNote, moods } = useContext(AuthContext);
    const [searchContent, setSearchContent] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [noteLikes, setNoteLikes] = useState({});

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Convert notes object to sorted array, filtering out entries that only have a mood but no content
    // Filter by content and date
    const filteredNotes = Object.entries(notes)
        .filter(([date, note]) => {
            const matchesContent = note.content && note.content.toLowerCase().includes(searchContent.toLowerCase());
            const matchesDate = !searchDate || date === searchDate;
            const isNotEmpty = note.content && note.content.trim().length > 0;
            return matchesContent && matchesDate && isNotEmpty;
        })
        .map(([date, note]) => ({ date, ...note, mood: moods[date] }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Load likes only if profile is public
    useEffect(() => {
        if (!user?.is_public || !token) return;

        const fetchLikes = async () => {
            try {
                const res = await fetchData('/note/my-likes', 'GET', null, token);
                setNoteLikes(res.data);
            } catch (err) {
                console.error('Error fetching note likes:', err);
            }
        };
        fetchLikes();
    }, [user?.is_public, token]);

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
            setIsModalOpen(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Recortamos espacios para evitar notas 'vacías' con solo espacios
        const trimmedContent = modalContent.trim();
        if (!modalDate || !trimmedContent) return;
        
        const res = await updateDayNote(modalDate, trimmedContent);
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
                    <Button onClick={handleOpenCreate}>+ Crear Nueva Nota</Button>
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
                    <CustomDatePicker
                        selected={searchDate ? new Date(searchDate + 'T00:00:00') : null}
                        onChange={(date) => setSearchDate(date ? date.toISOString().split('T')[0] : '')}
                        placeholder="Filtrar por fecha..."
                        isClearable
                    />
                </div>
            </div>

            <div className="notes-grid">
                {filteredNotes.length === 0 ? (
                    <div className="no-notes glass-card animate-fade-in">
                        <p>No se encontraron notas con ese criterio.</p>
                    </div>
                ) : (
                    filteredNotes.map((note, idx) => {
                        const likeCount = noteLikes[note.date] ?? null;
                        return (
                            <div 
                                key={note.date} 
                                className="note-card glass-card animate-fade-in" 
                                style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
                                onClick={() => handleOpenEdit(note)}
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
                                    <div className="note-card-right">
                                        {user?.is_public && likeCount !== null && (
                                            <span className={`note-likes-badge ${likeCount === 0 ? 'zero-likes' : ''}`} title="Likes de otros usuarios">
                                                {likeCount === 0 ? '🤍' : '❤️'} {likeCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="note-content">
                                    {note.content}
                                </div>
                            </div>
                        );
                    })
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
                        {isEditing && (
                            <Button variant="danger" onClick={() => handleDelete(modalDate)}>Eliminar Nota</Button>
                        )}
                        <Button type="submit">Guardar Nota</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default NotesPage;
