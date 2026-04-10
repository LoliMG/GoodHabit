import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './UserLayout.css';

const UserLayout = () => {
    const { logout, user } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className={`user-layout ${isMenuOpen ? 'menu-open' : ''}`}>
            <aside className={`sidebar glass-card ${isMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">GoodHabit</div>
                    <button className="menu-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                <div className="sidebar-user">
                    <span>Bienvenido, </span>
                    <strong>{user?.name}</strong>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                        <span className="icon">🏠</span> Calendario
                    </NavLink>
                    <NavLink to="/habits" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                        <span className="icon">🏆</span> Hábitos
                    </NavLink>
                    <NavLink to="/notes" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                        <span className="icon">📝</span> Mis Notas
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                        <span className="icon">👤</span> Perfil
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </aside>
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
