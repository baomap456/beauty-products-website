import React from 'react';
import AuthForm from '../../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';

const LoginPage = () => {
    const navigate = useNavigate();
    const handleLogin = async (data) => {
        try {
            const res = await login(data);
            localStorage.setItem('token', res.accessToken);
            const userRoleName = res.user?.Role?.Name_Role;
            localStorage.setItem('userRole', userRoleName);
            localStorage.setItem('currentUser', JSON.stringify(res.user));
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }

    };

    return <AuthForm mode="login" onSubmit={handleLogin} />;
};

export default LoginPage;