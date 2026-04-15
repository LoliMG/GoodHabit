import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button/Button';
import './Profile.css';

const Profile = () => {
    const { user, updateUserProfile, updateUserImage, habits, progress } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || "");
    const [isPublic, setIsPublic] = useState(user?.is_public || false);
    const [message, setMessage] = useState("");

    const totalCompletions = Object.values(progress).reduce((acc, day) => {
        return acc + Object.values(day).filter(Boolean).length;
    }, 0);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await updateUserProfile({ name, is_public: isPublic });
        if (res.success) {
            setMessage("¡Perfil actualizado con éxito! ✨");
        } else {
            setMessage("Error al actualizar el perfil ❌");
        }
        setTimeout(() => setMessage(""), 3000);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("img", file);

        const res = await updateUserImage(formData);
        if (res.success) {
            setMessage("¡Imagen de perfil actualizada! 📸");
        } else {
            setMessage("Error al subir la imagen ❌");
        }
        setTimeout(() => setMessage(""), 3000);
    };

    const calculateStreak = () => {
        if (!progress) return 0;
        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);

        // Retrocedemos día a día desde hoy
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayData = progress[dateStr];
            
            // Si el día tiene al menos un hábito completado (valor true)
            const completedCount = dayData ? Object.values(dayData).filter(Boolean).length : 0;
            
            if (completedCount > 0) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                // Si llegamos a un día (distinto de hoy aún pendiente) sin nada, paramos
                // Nota: Si hoy aún no has hecho nada, la racha sigue contando el ayer, 
                // pero si ayer no hiciste nada, hoy la racha es 0.
                if (streak === 0 && dateStr === today.toISOString().split('T')[0]) {
                    // Si hoy no hay nada, miramos ayer para ver si la racha sigue viva
                    currentDate.setDate(currentDate.getDate() - 1);
                    continue; 
                }
                break;
            }
        }
        return streak;
    };

    const currentStreak = calculateStreak();

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h2 className="animate-fade-in">Tu <span className="gradient-text">Perfil</span> 👤</h2>
                <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>Gestiona los ajustes de tu cuenta y mira tus estadísticas globales.</p>
            </header>

            <div className="avatar-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="avatar-preview">
                    {user?.image && user.image !== 'null' ? (
                        <img 
                            src={user.image.startsWith('http') ? user.image : `${import.meta.env.VITE_API_URL || ""}/images/users/${user.image}`} 
                            alt="Profile" 
                        />
                    ) : (
                        <div className="avatar-placeholder">{user?.name?.charAt(0).toUpperCase()}</div>
                    )}
                </div>
                <div className="avatar-controls">
                    <label htmlFor="avatar-upload" className="btn-upload">
                        📷 Cambiar Foto
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        hidden
                    />
                </div>
            </div>

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

                        <div className="form-group privacy-toggle">
                            <label className="switch-label">
                                <span>Perfil Público 🌍</span>
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                            </label>
                            <p className="field-note">Si activas esto, otros usuarios podrán ver tus notas y hábitos.</p>
                        </div>

                        <Button type="submit">Actualizar Perfil</Button>
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
                            <span>¡Racha de días!</span>
                            <strong>{currentStreak} {currentStreak === 1 ? 'Día' : 'Días'} seguidos</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
