import React from 'react';
import './ProfileSettings.css';

const ProfileSettings = ({ userName, setUserName, newPassword, setNewPassword, onUpdate }) => {
    return (
        <div className="profile-settings-card glass-card">
            <div className="settings-header">
                <h2>Ajustes de Cuenta</h2>
                <p>Gestiona tu identidad y seguridad en GoodHabit.</p>
            </div>
            
            <form className="settings-form" onSubmit={(e) => { e.preventDefault(); onUpdate(); }}>
                <div className="form-group">
                    <label>Nombre de Usuario</label>
                    <input 
                        type="text" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)} 
                        placeholder="Tu nuevo nombre..."
                    />
                </div>
                
                <div className="form-group">
                    <label>Cambiar Contraseña</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        placeholder="Deja en blanco para no cambiar..."
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-save-settings">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
