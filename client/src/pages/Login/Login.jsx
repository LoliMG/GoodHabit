import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import './Login.css';

const Login = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleGoogleSuccess = async (tokenResponse) => {
    const result = await loginWithGoogle(tokenResponse);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Error al conectar con Google")
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card">
        <h2>Bienvenido de nuevo</h2>
        <p>Inicia sesión para continuar tu viaje.</p>
        
        <button type="button" className="btn-google" onClick={() => handleGoogleLogin()}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continuar con Google
        </button>

        <div className="separator">
          <span>O</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="nombre@ejemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">Iniciar Sesión</button>
        </form>
        <div className="login-footer">
          <p>¿No tienes cuenta? <Link to="/register" className="gradient-text">Registrarse</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
