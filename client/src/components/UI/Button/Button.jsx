import React from 'react';
import './Button.css';

const Button = ({ 
    children, 
    onClick, 
    type = 'button', 
    variant = 'primary', 
    className = '', 
    disabled = false,
    ...props 
}) => {
    return (
        <button
            type={type}
            className={`gh-button gh-button--${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
