import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                {title && <h2>{title}</h2>}
                {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
