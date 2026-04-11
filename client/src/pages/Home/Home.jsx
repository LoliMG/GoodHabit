import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Home.css';

const Home = () => {
    const { user } = useContext(AuthContext);
    const year = new Date().getFullYear();

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">GH.</div>
                <div className="nav-links">
                    <a href="#features" className="nav-link">Características</a>
                    {user ? (
                        <Link to="/dashboard" className="btn-nav">Panel</Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn-nav">Iniciar Sesión</Link>
                        </>
                    )}
                </div>
            </nav>

            <header className="hero section-padding">
                <div className="hero-content">
                    <div className="status-badge">Disponible para Beta v2.1 🌿</div>
                    <h1>Domina tus <br /><span className="gradient-text">Rutinas con Elegancia.</span></h1>
                    <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        La forma más <span className="text-white">simple y elegante</span> de mantener tus rutinas bajo control. Sin distracciones, solo tú y tus metas diarias.
                    </p>
                    <div className="hero-actions">
                        {user ? (
                            <Link to="/dashboard" className="btn-primary">Volver al Panel</Link>
                        ) : (
                            <Link to="/register" className="btn-primary">Crea tu Cuenta</Link>
                        )}
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="obsidian-stack">
                        <div className="glass-card panel-main">
                            <div className="panel-header">
                                <span className="p-dot red"></span>
                                <span className="p-dot yellow"></span>
                                <span className="p-dot green"></span>
                            </div>
                            <div className="panel-body">
                                <div className="p-row">
                                    <div className="p-box"></div>
                                    <div className="p-text-line"></div>
                                </div>
                                <div className="p-row active">
                                    <div className="p-box primary"></div>
                                    <div className="p-text-line"></div>
                                </div>
                                <div className="p-row">
                                    <div className="p-box"></div>
                                    <div className="p-text-line"></div>
                                </div>
                            </div>
                        </div>
                        <div className="stats-box glass-card">
                            <span>Tasa de Éxito</span>
                            <strong>98.4%</strong>
                        </div>
                    </div>
                </div>
            </header>

            <section id="features" className="features section-padding">
                <h2 className="section-title">Herramientas Minimalistas. <br />Resultados Poderosos.</h2>
                <div className="features-grid">
                    <div className="feature-card glass-card">
                        <div className="f-icon">🎯</div>
                        <h3>Enfoque Total</h3>
                        <p>Una interfaz limpia y minimalista diseñada para eliminar cualquier distracción de tu camino.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="f-icon">📊</div>
                        <h3>Progreso Real</h3>
                        <p>Visualiza tus estadísticas y rachas semanales para mantener la motivación siempre alta.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="f-icon">☁️</div>
                        <h3>Sincronía</h3>
                        <p>Tus hábitos están siempre actualizados y disponibles en todos tus dispositivos.</p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">GH.</div>
                    <p>&copy; {year} GoodHabit. Crecimiento personal hecho simple.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;