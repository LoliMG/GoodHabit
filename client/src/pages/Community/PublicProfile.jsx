import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData } from '../../helpers/axiosHelper';
import './PublicProfile.css';

const PublicProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            
            <header className="profile-hero">
                <div className="avatar-large">{user.name.charAt(0).toUpperCase()}</div>
                <h1>{user.name}</h1>
                <p className="since">En GoodHabit desde {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                
                <div className="public-stats-row">
                    <div className="mini-stat glass-card">
                        <strong>{habits.length}</strong>
                        <span>Hábitos</span>
                    </div>
                    <div className="mini-stat glass-card">
                        <strong>{sortedNotes.length}</strong>
                        <span>Notas</span>
                    </div>
                </div>
            </header>

            <div className="public-content-grid">
                <section className="public-habits">
                    <h3>Hábitos que cultiva</h3>
                    <div className="habits-list">
                        {habits.map(h => (
                            <div key={h.id} className="public-habit-item glass-card">
                                <span className="icon">{h.icon}</span>
                                <span className="name">{h.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="public-notes">
                    <h3>Reflexiones Públicas</h3>
                    <div className="notes-list">
                        {sortedNotes.length === 0 ? (
                            <p className="no-notes">Este usuario aún no ha compartido reflexiones.</p>
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
                                    <div className="note-body">{n.content}</div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PublicProfile;
