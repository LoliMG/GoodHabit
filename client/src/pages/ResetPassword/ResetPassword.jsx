import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../../helpers/axiosHelper';
import AuthLayout from '../../components/Auth/AuthLayout';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return setError('Las contraseñas no coinciden');
        setError('');
        setLoading(true);

        try {
            await fetchData('/user/reset-password', 'POST', { token, newPassword: password });
            setMessage('Contraseña actualizada con éxito. Ya puedes iniciar sesión.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'El token es inválido o ha expirado');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <AuthLayout title="Enlace inválido" subtitle="No se ha proporcionado un token de recuperación válido.">
                <Link to="/login" className="btn-primary w-full" style={{ textDecoration: 'none', textAlign: 'center' }}>Ir al Login</Link>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Crea tu nueva contraseña" subtitle="Asegúrate de que sea segura y difícil de adivinar.">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="message-success" style={{ 
                background: 'hsla(174, 100%, 41%, 0.1)', 
                color: 'var(--primary)', 
                padding: '1rem', 
                borderRadius: '14px', 
                marginBottom: '2rem',
                textAlign: 'center'
            }}>{message}</div>}

            {!message && (
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nueva Contraseña</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Contraseña</label>
                        <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary w-full" disabled={loading}>
                        {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            )}

            <div className="auth-footer">
                <p>¿Recordaste tu contraseña? <Link to="/login" className="gradient-text">Iniciar Sesión</Link></p>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
