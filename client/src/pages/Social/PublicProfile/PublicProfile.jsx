import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData } from '../../../helpers/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext';
import './PublicProfile.css';

const PublicProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { addHabit } = useContext(AuthContext);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('habits'); // 'habits' o 'notes'
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
            setCopyMessage(`¡"${name}" añadido a tu Dashboard! 🚀`);
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
    const sortedNotes = notes
        .filter(n => n.content && n.content.trim() !== '')
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="public-profile-container">
            <button className="btn-back" onClick={() => navigate('/community')}>← Volver a la Comunidad</button>

            {copyMessage && <div className="copy-toast animate-slide-down">{copyMessage}</div>}

            <header className="profile-hero">
                <div className="avatar-large">{user.name.charAt(0).toUpperCase()}</div>
                <h1>{user.name}</h1>
                <p className="since">Miembro de GoodHabit desde {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>

                <div className="public-stats-selector">
                    <div
                        className={`stat-box glass-card`}
                    >
                        <span className="count">{habits.length}</span>
                        <span className="label">HÁBITOS</span>
                    </div>
                    <div
                        className={`stat-box glass-card`}
                    >
                        <span className="count">{sortedNotes.length}</span>
                        <span className="label">NOTAS</span>
                    </div>
                </div>
            </header>

            <nav className="bootstrap-tabs-nav">
                <button
                    className={`tab-link ${activeTab === 'habits' ? 'active' : ''}`}
                    onClick={() => setActiveTab('habits')}
                >
                    <span className="icon">✨</span> Hábitos
                </button>
                <button
                    className={`tab-link ${activeTab === 'notes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notes')}
                >
                    <span className="icon">📝</span> Notas
                </button>
            </nav>

            <main className="tab-content-area">
                {activeTab === 'habits' ? (
                    <section className="tab-pane animate-fade-in">
                        <h2 className="content-title">Hábitos que cultiva ✨</h2>
                        <div className="public-habits-grid">
                            {habits.length === 0 ? (
                                <p className="empty-msg">Este usuario no tiene hábitos públicos.</p>
                            ) : (
                                habits.map(h => (
                                    <div key={h.id} className="public-habit-card glass-card">
                                        <div className="habit-icon">{h.icon}</div>
                                        <div className="habit-name">{h.name}</div>
                                        <button
                                            className="add-to-me-btn"
                                            onClick={(e) => { e.stopPropagation(); handleAddHabit(h.name, h.icon); }}
                                            title="Añadir a mis hábitos"
                                        >
                                            ＋
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                ) : (
                    <section className="tab-pane animate-fade-in">
                        <h2 className="content-title">Reflexiones Públicas 📝</h2>
                        <div className="public-notes-stack">
                            {sortedNotes.length === 0 ? (
                                <p className="empty-msg">Este usuario no ha compartido reflexiones aún.</p>
                            ) : (
                                sortedNotes.map(n => (
                                    <div key={n.date} className="public-note-item glass-card">
                                        <div className="note-header">
                                            <span className="date-tag">
                                                {new Date(n.date).toLocaleDateString('es-ES', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="note-text">{n.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default PublicProfile;
