import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchData } from '../../../helpers/axiosHelper';
import UserProfileHeader from '../../../components/User/UserProfileHeader/UserProfileHeader';
import './PublicProfile.css';

const PublicProfile = () => {
    const { userId } = useParams();
    const [publicUser, setPublicUser] = useState(null);
    const [publicHabits, setPublicHabits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicUser = async () => {
            try {
                const res = await fetchData(`/user/public/${userId}`, 'GET');
                setPublicUser(res.data.user);
                setPublicHabits(res.data.habits || []);
            } catch (error) {
                console.error("Error al cargar perfil público:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicUser();
    }, [userId]);

    if (loading) return <div className="loading-state">Cargando perfil...</div>;
    if (!publicUser) return <div className="error-state">Usuario no encontrado</div>;

    return (
        <div className="public-profile-container">
            <UserProfileHeader user={publicUser} isPublic={true} />

            <section className="public-stats-grid">
                <div className="stat-card glass-card">
                    <span className="stat-value">{publicHabits.length}</span>
                    <span className="stat-label">Hábitos Activos</span>
                </div>
                <div className="stat-card glass-card">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Logros</span>
                </div>
                <div className="stat-card glass-card">
                    <span className="stat-value">67</span>
                    <span className="stat-label">Días Totales</span>
                </div>
            </section>

            <section className="public-habits-section">
                <h2 className="section-title">En qué está trabajando {publicUser.user_name}</h2>
                <div className="public-habits-grid">
                    {publicHabits.map(habit => (
                        <div key={habit.id} className="public-habit-item glass-card">
                            <span className="icon">{habit.icon}</span>
                            <span className="name">{habit.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="public-footer">
                <Link to="/social" className="btn-back">← Volver a Comunidad</Link>
            </footer>
        </div>
    );
};

export default PublicProfile;
