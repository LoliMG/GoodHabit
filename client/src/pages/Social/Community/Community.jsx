import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchData } from '../../../helpers/axiosHelper';
import './Community.css';

const Community = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const res = await fetchData("/user/public-users", "GET");
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching community:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunity();
    }, []);

    return (
        <div className="community-container">
            <header className="community-header">
                <h2 className="animate-fade-in">Comunidad <span className="gradient-text">Explora</span> 🌍</h2>
                <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>Descubre cómo otros usuarios mantienen su disciplina y lee sus reflexiones.</p>
            </header>

            {loading ? (
                <div className="loading-state">Cargando comunidad...</div>
            ) : (
                <div className="community-grid">
                    {users.length === 0 ? (
                        <div className="no-users glass-card">
                            <p>Aún no hay perfiles públicos disponibles. ¡Sé el primero en compartir el tuyo!</p>
                        </div>
                    ) : (
                        users.map((u, idx) => (
                            <Link 
                                to={`/community/user/${u.id}`} 
                                key={u.id} 
                                className="user-card glass-card animate-fade-in"
                                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                            >
                                <div className="user-avatar">
                                    {u.image && u.image !== 'null' ? (
                                        <img 
                                            src={u.image.startsWith('http') ? u.image : `${import.meta.env.VITE_API_URL || ""}/images/users/${u.image}`} 
                                            alt={u.name} 
                                            className="avatar-img"
                                        />
                                    ) : (
                                        <span className="avatar-letter">{u.name?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="user-info">
                                    <h3>{u.name}</h3>
                                    <p>Miembro desde {new Date(u.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="user-action-arrow">→</div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Community;
