import React from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        const res = await login(data);
        localStorage.setItem('token', res.accessToken); // lưu token
        navigate('/dashboard'); // redirect sau login
    };

    return <AuthForm mode="login" onSubmit={handleLogin} />;
};

export default LoginPage;