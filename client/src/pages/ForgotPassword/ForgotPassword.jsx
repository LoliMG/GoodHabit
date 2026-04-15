import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchData } from '../../helpers/axiosHelper';
import AuthLayout from '../../components/Auth/AuthLayout';
import Button from '../../components/UI/Button/Button';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await fetchData('/user/forgot-password', 'POST', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="¿Olvidaste tu contraseña?" subtitle="Introduce tu correo y te enviaremos un enlace para recuperarla.">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="message-success" style={{
                background: 'hsla(174, 100%, 41%, 0.1)',
                color: 'var(--primary)',
                padding: '1rem',
                borderRadius: '14px',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>{message}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" placeholder="nombre@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar enlace'}
                </Button>
            </form>

            <div className="auth-footer">
                <p>Volver al <Link to="/login" className="gradient-text">Iniciar Sesión</Link></p>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
