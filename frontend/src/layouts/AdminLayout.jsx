import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Navbar from '../components/admin/Navbar';

const drawerWidth = 240;

const AdminLayout = ({ user }) => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Navbar />
            <Sidebar fullname={user?.FullName || user?.fullName || 'Admin'} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    bgcolor: 'background.default',
                    minHeight: '100vh'
                }}
            >
                {/* spacer same height as AppBar */}
                <Toolbar />
                {/* page content */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;