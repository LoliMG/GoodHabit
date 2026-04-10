import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = () => {
    const { user, isAuthLoading } = useContext(AuthContext);

    if (isAuthLoading) {
        return <div className="loading">Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
