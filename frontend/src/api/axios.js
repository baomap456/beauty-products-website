import axios from 'axios';

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // baseURL backend của bạn
    headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Xóa token và chuyển hướng về trang login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;