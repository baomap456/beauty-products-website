import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container, Tooltip, Avatar, Menu, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const { cartCount } = useCart()
    React.useEffect(() => {
        const checkUserLoggedIn = () => {
            const storedUser = localStorage.getItem('currentUser');
            const token = localStorage.getItem('token');
            const storedRole = localStorage.getItem('userRole');

            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Lỗi parse user:", e);
                    setUser(null);
                }
            } else {
                setUser(null); // Reset nếu không có token
                setIsAdmin(false);
            }

            if (storedRole === 'admin') {
                setIsAdmin(true);
            }
        };
        checkUserLoggedIn();
        window.addEventListener('storage', checkUserLoggedIn);
        return () => {
            window.removeEventListener('storage', checkUserLoggedIn);
        };
    }, []);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    // Hàm đóng menu
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        // Xóa sạch LocalStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');

        // Reset state user về null
        setUser(null);
        handleCloseUserMenu();

        // Chuyển về trang login hoặc trang chủ
        navigate('/login');
    };

    return (
        <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    {/* LOGO */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontWeight: 700, color: 'primary.main', textDecoration: 'none' }}
                    >
                        MY-SHOP
                    </Typography>

                    {/* MENU GIỮA (Giữ nguyên) */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button component={Link} to="/" sx={{ my: 2, color: 'text.primary', display: 'block' }}>Trang chủ</Button>
                        <Button component={Link} to="/shop" sx={{ my: 2, color: 'text.primary', display: 'block' }}>Sản phẩm</Button>
                    </Box>

                    {/* ACTIONS BÊN PHẢI */}
                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                        {isAdmin && (
                            <Tooltip title="Go to Dashboard">
                                <IconButton
                                    size="large"
                                    color="inherit"
                                    onClick={() => navigate('/dashboard')}
                                    sx={{ mr: 2 }}
                                >
                                    {/* Icon Dashboard (Bạn cần import nó: import DashboardIcon from '@mui/icons-material/Dashboard';) */}
                                    <DashboardIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {/* Giỏ hàng */}
                        <IconButton size="large" aria-label="show cart items" color="inherit" onClick={() => navigate('/cart')} sx={{ mr: 2 }}>
                            <Badge badgeContent={cartCount} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>

                        {/* --- LOGIC HIỂN THỊ USER HOẶC LOGIN --- */}
                        {user ? (
                            // TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP
                            <>
                                {/* Dòng chữ Hello */}
                                <Typography variant="body1" sx={{ mr: 2, color: 'text.primary', display: { xs: 'none', sm: 'block' } }}>
                                    Hello, <b>{user.FullName || user.username}</b> {/* Thay tên trường cho đúng API của bạn */}
                                </Typography>

                                {/* Avatar Icon */}
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        {/* Hiển thị Avatar hoặc chữ cái đầu của tên */}
                                        <Avatar alt={user.FullName} src="/static/images/avatar/2.jpg">
                                            {user.FullName ? user.FullName.charAt(0).toUpperCase() : 'U'}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>

                                {/* Dropdown Menu */}
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleCloseUserMenu(); }}>
                                        <Typography textAlign="center">Profile</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center" color="error">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            // TRƯỜNG HỢP CHƯA ĐĂNG NHẬP
                            <Button variant="contained" size="small" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};


export default Header;