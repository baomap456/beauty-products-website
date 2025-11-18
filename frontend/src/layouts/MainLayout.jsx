import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh' // Đảm bảo footer luôn nằm dưới cùng
        }}>
            {/* 1. Header luôn hiển thị ở trên */}
            <Header />

            {/* 2. Phần nội dung thay đổi (HomePage, ShopPage...) sẽ nằm ở đây */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>

            {/* 3. Footer luôn hiển thị ở dưới */}
            <Footer />
        </Box>
    );
};

export default MainLayout;