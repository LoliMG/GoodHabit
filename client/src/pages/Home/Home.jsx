import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container full-screen">
            <main className="content">
                <section className="hero-unified">
                    <div className="status-badge-container">
                        <span className="status-badge">✨ Nueva versión 2.0 disponible</span>
                    </div>
                    
                    <h1 className="hero-title">Empieza tu viaje hacia una vida <span className="gradient-text">mejor</span></h1>
                    
                    <p className="hero-description">
                        Organiza tu vida, construye hábitos saludables y mantén la motivación 
                        con un diseño minimalista y potente. Todo en uno.
                    </p>
                    
                    <div className="hero-actions">
                        <Link to="/register" className="btn-primary-large">Crea tu cuenta</Link>
                        <Link to="/login" className="btn-secondary-large">Iniciar sesión</Link>
                    </div>

                    <div className="features-compact-grid">
                        <div className="feature-mini-card">
                            <span className="icon">📊</span>
                            <div className="text">
                                <h3>Análisis Visual</h3>
                                <p>Observa tu progreso con gráficos minimalistas y un calendario inteligente.</p>
                            </div>
                        </div>
                        <div className="feature-mini-card">
                            <span className="icon">📝</span>
                            <div className="text">
                                <h3>Diario Personal</h3>
                                <p>Reflexiona sobre tu día y guarda notas para cada hábito que completes.</p>
                            </div>
                        </div>
                        <div className="feature-mini-card">
                            <span className="icon">🤝</span>
                            <div className="text">
                                <h3>Comunidad Real</h3>
                                <p>Conecta con otros usuarios y comparte tus logros para mantener la motivación.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;