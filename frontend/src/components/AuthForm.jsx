import React from "react";
import { TextField, Button, Box, Typography } from '@mui/material';
const AuthForm = ({ mode = 'login', onSubmit }) => {
    const [formData, setFormData] = React.useState(
    mode === 'login'
        ? { Email: '', Password: '' }
        : { FullName: '', Email: '', Password: '' }
    );
    const [error, setError] = React.useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log('Submitting payload:', formData); 
        console.log(formData)
        try {
            await onSubmit(formData);
        } catch (error) {
            setError(error.response?.data?.error || error.message);
        }

    };
    return (
        <Box maxWidth={400} mx="auto" mt={5} p={3} boxShadow={3}>
            <Typography variant="h5" textAlign="center" mb={3}>
                {mode === 'login' ? 'Login' : 'Register'}
            </Typography>
            <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                    <TextField
                        label="Full Name"
                        name="FullName"
                        value={formData.FullName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                )}
                <TextField
                    label="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    name="Password"
                    type="password"
                    value={formData.Password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    {mode === 'login' ? 'Login' : 'Register'}
                </Button>
            </form>
        </Box>
    );
};

export default AuthForm;
