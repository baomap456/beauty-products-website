import React, { use } from 'react';
import AuthForm from '../../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
const LoginPage = () => {
    const navigate = useNavigate();
    const handleLogin = async (data) => {
    try {
        // 1. Đăng nhập & Lưu Token (QUAN TRỌNG NHẤT)
        const res = await login(data);
        console.log("Dữ liệu trả về từ Login:", res); 
        console.log("Token sắp lưu:", res.accessToken);
        localStorage.setItem('token', res.accessToken);
        const userRoleName = res.user?.Role?.Name_Role;
        localStorage.setItem('userRole', userRoleName);
        localStorage.setItem('currentUser', JSON.stringify(res.user));

        // 2. Xử lý Giỏ hàng (Trong try-catch riêng để không ảnh hưởng Login)
        // try {
        //     const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        //     const itemsToMerge = localCart.map(item => ({
        //         Product_ID: item.ID_Product || item.id,
        //         Quantity: item.Quantity || item.quantity
        //     }));
        //     if (localCart.length > 0) {
        //         // Gọi API gộp (hàm này phải được import từ api/user/cart)
        //         await mergeCarts(itemsToMerge); 
        //         localStorage.removeItem('cartItems');
        //     }
        //     // Cập nhật lại Context sau khi gộp xong
        // } catch (cartError) {
        //     console.log('Lỗi khi gộp giỏ hàng (nhưng vẫn cho login):', cartError);
        // }
        // window.dispatchEvent(new Event("storage"));
        navigate('/'); // Chuyển hướng sau khi đăng nhập thành công
        } catch (error) {
            console.error('Login failed:', error);
            alert("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
        }
    };

    return <AuthForm mode="login" onSubmit={handleLogin} />;
};

export default LoginPage;