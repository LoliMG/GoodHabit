import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { fetchData } from '../../../helpers/axiosHelper';
import './PublicProfile.css';

const PublicProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { addHabit, token } = useContext(AuthContext);

    const [publicUser, setPublicUser] = useState(null);
    const [publicHabits, setPublicHabits] = useState([]);
    const [publicNotes, setPublicNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('habits'); 
    const [toast, setToast] = useState("");

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const res = await fetchData(`/user/public-user/${userId}`, 'GET', null, token);
                setPublicUser(res.data.user);
                setPublicHabits(res.data.habits || []);
                setPublicNotes(res.data.notes || []);
            } catch (error) {
                console.error("Error al cargar perfil público:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicData();
    }, [userId, token]);

    const handleCopyHabit = async (habit) => {
        try {
            await addHabit(habit.name, habit.icon);
            setToast(`¡Copiado: ${habit.name}! ✨`);
            setTimeout(() => setToast(""), 3000);
        } catch (error) {
            console.error("Error al copiar hábito:", error);
        }
    };

    const handleToggleLike = async (noteId) => {
        if (!token) return navigate('/login');
        try {
            const res = await fetchData(`/note/likes/${noteId}`, 'PUT', null, token);
            if (res.success) {
                // Actualizar localmente la nota que recibió el like
                setPublicNotes(prev => prev.map(n => 
                    n.id === noteId 
                        ? { ...n, likes_count: res.data.likes_count, liked_by_user: res.data.liked_by_user } 
                        : n
                ));
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    if (loading) return <div className="loading-state">Descifrando perfil... 🔍</div>;
    if (!publicUser) return <div className="loading-state">Usuario no encontrado ❌</div>;

    return (
        <div className="public-profile-container">
            {toast && <div className="copy-toast">{toast}</div>}
            
            <button className="btn-back" onClick={() => navigate('/community')}>
                ← Volver a Comunidad
            </button>

            <header className="profile-hero">
                <div className="avatar-large">
                    {publicUser.image && publicUser.image !== 'null' ? (
                        <img 
                            src={publicUser.image.startsWith('http') ? publicUser.image : `${import.meta.env.VITE_API_URL || ""}/images/users/${publicUser.image}`} 
                            alt={publicUser.name}
                            className="avatar-img"
                        />
                    ) : (
                        <span>{publicUser.name.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <h1 className="gradient-text">{publicUser.name}</h1>
                <p className="since">Miembro de GoodHabit desde {new Date(publicUser.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>

                <div className="bootstrap-tabs-nav">
                    <button 
                        className={`tab-link ${activeTab === 'habits' ? 'active' : ''}`}
                        onClick={() => setActiveTab('habits')}
                    >
                        <span className="icon">🔥</span> Hábitos
                    </button>
                    <button 
                        className={`tab-link ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        <span className="icon">📝</span> Notas
                    </button>
                </div>
            </header>

            <main className="tab-content-area">
                {activeTab === 'habits' ? (
                    <section className="habits-view animate-fade-in">
                        <div className="public-habits-grid">
                            {publicHabits.length > 0 ? (
                                publicHabits.map(habit => (
                                    <div key={habit.id} className="public-habit-card glass-card">
                                        <span className="habit-icon">{habit.icon}</span>
                                        <span className="habit-name">{habit.name}</span>
                                        <button 
                                            className="add-to-me-btn" 
                                            title="Copiar a mis hábitos"
                                            onClick={() => handleCopyHabit(habit)}
                                        >
                                            +
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-msg">Este usuario aún no tiene hábitos para mostrar.</p>
                            )}
                        </div>
                    </section>
                ) : (
                    <section className="notes-view animate-fade-in">
                        <div className="public-notes-stack">
                            {publicNotes.length > 0 ? (
                                publicNotes.map(note => (
                                    <div key={note.id} className="public-note-item glass-card">
                                        <div className="note-header">
                                            <span className="date-tag">
                                                {new Date(note.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                            <button 
                                                className={`like-btn ${note.liked_by_user ? 'liked' : ''}`}
                                                onClick={() => handleToggleLike(note.id)}
                                            >
                                                <span className="heart-icon">{note.liked_by_user ? '❤️' : '🤍'}</span>
                                                <span className="like-count">{note.likes_count}</span>
                                            </button>
                                        </div>
                                        <p className="note-text">{note.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-msg">No hay notas públicas para mostrar.</p>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default PublicProfile;
