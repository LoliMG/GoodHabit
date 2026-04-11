import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData } from '../../helpers/axiosHelper';
import { AuthContext } from '../../contexts/AuthContext';
import './PublicProfile.css';

const PublicProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { addHabit } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('habits');
    const [copyMessage, setCopyMessage] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetchData(`/user/public-user/${userId}`, "GET");
                setData(res.data);
            } catch (err) {
                console.error("Error fetching public profile:", err);
                setError(err.response?.data?.message || "Error al cargar el perfil");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleAddHabit = async (name, icon) => {
        try {
            await addHabit(name, icon);
            setCopyMessage(`¡Has añadido "${name}" a tus hábitos! 🚀`);
            setTimeout(() => setCopyMessage(""), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="loading-state">Cargando perfil...</div>;
    if (error) return (
        <div className="error-container">
            <div className="error-card glass-card">
                <h2>Opps! 🔒</h2>
                <p>{error}</p>
                <button className="btn-primary" onClick={() => navigate('/community')}>Volver a la Comunidad</button>
            </div>
        </div>
    );

    const { user, habits, notes } = data;

    // Sort notes
    const sortedNotes = notes
        .filter(n => n.content && n.content.trim() !== '')
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="public-profile-container">
            <button className="btn-back" onClick={() => navigate('/community')}>← Volver</button>
            
            {copyMessage && <div className="copy-toast glass-glow">{copyMessage}</div>}

            <header className="profile-hero">
                <div className="avatar-large">{user.name.charAt(0).toUpperCase()}</div>
                <h1>{user.name}</h1>
                <p className="since">En GoodHabit desde {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                
                <div className="public-stats-row">
                    <div 
                        className={`mini-stat glass-card ${activeTab === 'habits' ? 'active' : ''}`}
                        onClick={() => setActiveTab('habits')}
                        style={{ cursor: 'pointer' }}
                    >
                        <strong>{habits.length}</strong>
                        <span>Hábitos</span>
                    </div>
                    <div 
                        className={`mini-stat glass-card ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                        style={{ cursor: 'pointer' }}
                    >
                        <strong>{sortedNotes.length}</strong>
                        <span>Notas</span>
                    </div>
                </div>
            </header>

            <div className="public-content-view">
                {activeTab === 'habits' ? (
                    <section className="public-habits animate-fade-in">
                        <h3 className="section-title">Hábitos que cultiva ✨</h3>
                        <div className="habits-grid">
                            {habits.length === 0 ? (
                                <p className="no-data">Este usuario no tiene hábitos públicos.</p>
                            ) : (
                                habits.map(h => (
                                    <div key={h.id} className="public-habit-item glass-card">
                                        <div className="habit-info-wrapper">
                                            <span className="habit-icon">{h.icon}</span>
                                            <span className="habit-name">{h.name}</span>
                                        </div>
                                        <button 
                                            className="copy-habit-btn" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddHabit(h.name, h.icon);
                                            }}
                                            title="Copiar a mis hábitos"
                                        >
                                            ＋
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                ) : (
                    <section className="public-notes animate-fade-in">
                        <h3 className="section-title">Reflexiones Públicas 📝</h3>
                        <div className="notes-list">
                            {sortedNotes.length === 0 ? (
                                <p className="no-data">Este usuario no ha compartido reflexiones.</p>
                            ) : (
                                sortedNotes.map(n => (
                                    <div key={n.date} className="public-note-card glass-card">
                                        <div className="note-card-header">
                                            <span className="note-date">
                                                {new Date(n.date).toLocaleDateString('es-ES', { 
                                                    day: 'numeric', 
                                                    month: 'long', 
                                                    year: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                        <p className="note-body">{n.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default PublicProfile;
