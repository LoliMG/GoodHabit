import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import AuthLayout from '../../components/Auth/AuthLayout';
import GoogleButton from '../../components/Auth/GoogleButton';
import Button from '../../components/UI/Button/Button';

const Login = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loginWithGoogle(tokenResponse).then((result) => {
        if (result.success) navigate('/dashboard');
        else setError(result.message);
      });
    },
    onError: () => setError("Error al conectar con Google")
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <AuthLayout title="Bienvenido de nuevo" subtitle="Inicia sesión para continuar tu viaje.">
      <GoogleButton onClick={handleGoogleLogin} text="Continuar con Google" />

      {error && <div className="error-message">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input type="email" placeholder="nombre@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full">Iniciar Sesión</Button>
      </form>

      <div className="auth-footer">
        <p style={{marginBottom: '0.8rem'}}>¿Olvidaste tu contraseña? <Link to="/forgot-password" name="Recuperala" className="gradient-text">Recupérala</Link></p>
        <p>¿No tienes cuenta? <Link to="/register" className="gradient-text">Registrarse</Link></p>
      </div>
    </AuthLayout>
  );
};

export default Login;
