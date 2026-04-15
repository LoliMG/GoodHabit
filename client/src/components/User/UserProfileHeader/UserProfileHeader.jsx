import React from 'react';
import './UserProfileHeader.css';

const UserProfileHeader = ({ user, isPublic = false }) => {
    const avatarUrl = user?.image 
        ? `${import.meta.env.VITE_API_URL || ''}/uploads/profiles/${user.image}` 
        : 'https://via.placeholder.com/150';

    return (
        <header className="user-profile-header">
            <div className="avatar-container glass-card">
                <img src={avatarUrl} alt={user?.user_name} className="profile-img" />
                <div className="online-indicator"></div>
            </div>
            <div className="user-info-text">
                <h1>{user?.user_name}</h1>
                <div className="badge-row">
                    <span className="user-badge glass-card">🌟 Nivel 12</span>
                    <span className="user-badge glass-card">🔥 15 Días seguidos</span>
                </div>
                {isPublic && (
                    <p className="user-bio">Este es un perfil público. ¡Mira mis hábitos y motívate!</p>
                )}
            </div>
        </header>
    );
};

export default UserProfileHeader;
