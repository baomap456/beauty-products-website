import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

const Navbar = () => {
    return (
        <AppBar
            position="fixed"
            elevation={1}
            sx={{
                zIndex: (t) => t.zIndex.drawer + 1,
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                bgcolor: 'primary.main',
                boxShadow: 1
            }}
        >
            <Toolbar sx={{ minHeight: 64 }}>
                <Typography variant="h6" noWrap component="div">
                    Admin
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;