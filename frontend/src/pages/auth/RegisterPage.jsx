import React from 'react';
import AuthForm from '../../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';

const RegisterPage = () => {
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        await register(data);
        navigate('/login'); // redirect sau register
    };

    return <AuthForm mode="register" onSubmit={handleRegister} />;
};

export default RegisterPage;