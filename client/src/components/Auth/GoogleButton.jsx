import React from 'react';
import './AuthLayout.css';

const GoogleButton = ({ onClick, text = "Continuar con Google" }) => {
    return (
        <>
            <button type="button" className="btn-google" onClick={onClick}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                {text}
            </button>
            <div className="separator">
                <span>O</span>
            </div>
        </>
    );
};

export default GoogleButton;
