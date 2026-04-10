import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import '../Login/Login.css';

const Register = () => {
  const { register, loginWithGoogle } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
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

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Error al conectar con Google")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    const result = register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card">
        <h2>Únete a <span className="gradient-text">GoodHabit</span></h2>
        <p>Empieza a construir una mejor versión de ti mismo hoy.</p>

        <button type="button" className="btn-google" onClick={() => handleGoogleRegister()}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Registrarse con Google
        </button>

        <div className="separator">
          <span>O</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              name="name"
              placeholder="Juan Pérez" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              name="email"
              placeholder="nombre@ejemplo.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="••••••••" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">Crear Cuenta</button>
        </form>
        <div className="login-footer">
          <p>¿Ya tienes cuenta? <Link to="/login" className="gradient-text">Iniciar Sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
