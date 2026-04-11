import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user, updateUserProfile, habits, progress } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || "");
    const [message, setMessage] = useState("");

    const totalCompletions = Object.values(progress).reduce((acc, day) => {
        return acc + Object.values(day).filter(Boolean).length;
    }, 0);

    const handleUpdate = (e) => {
        e.preventDefault();
        updateUserProfile({ name });
        setMessage("¡Perfil actualizado con éxito! ✨");
        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h2 className="animate-fade-in">Tu <span className="gradient-text">Perfil</span> 👤</h2>
                <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>Gestiona los ajustes de tu cuenta y mira tus estadísticas globales.</p>
            </header>

            <div className="profile-grid">
                <div className="profile-settings glass-card">
                    <h3>Información de Cuenta</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input 
                                type="email" 
                                value={user?.email || ""} 
                                placeholder={user?.email ? "" : "Cargando o no disponible..."}
                                disabled 
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            />
                            <p className="field-note">El correo no se puede cambiar.</p>
                        </div>
                        <button type="submit" className="btn-primary">Actualizar Perfil</button>
                        {message && <p className="success-message">{message}</p>}
                    </form>
                </div>

                <div className="profile-stats">
                    <div className="stat-card glass-card">
                        <span className="stat-icon">📈</span>
                        <div className="stat-content">
                            <span>Total Hábitos</span>
                            <strong>{habits.length}</strong>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <span className="stat-icon">✅</span>
                        <div className="stat-content">
                            <span>Completados Totales</span>
                            <strong>{totalCompletions}</strong>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <span className="stat-icon">📅</span>
                        <div className="stat-content">
                            <span>Miembro Desde</span>
                            <strong>Abril 2024</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
