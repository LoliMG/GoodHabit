import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PublicRoute = () => {
    const { user, isAuthLoading } = useContext(AuthContext);
    
    if (isAuthLoading) {
        return <div className="loading">Loading...</div>;
    }

    return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
