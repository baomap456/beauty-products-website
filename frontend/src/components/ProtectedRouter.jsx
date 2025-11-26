import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    if (userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;