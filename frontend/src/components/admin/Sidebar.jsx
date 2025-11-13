import React from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Avatar, Typography } from '@mui/material';
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ fullname }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Users', path: '/dashboard/users', icon: <PeopleIcon /> },
    { text: 'Products', path: '/dashboard/products', icon: <StorefrontIcon /> },
    { text: 'Orders', path: '/dashboard/orders', icon: <ReceiptLongIcon /> },
    { text: 'Logout', icon: <LogoutIcon />, onClick: handleLogout }
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth },
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{fullname ? fullname.charAt(0).toUpperCase() : ''}</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>Hello, {fullname}</Typography>
            <Typography variant="caption" color="text.secondary">Manage store</Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const selected = item.path && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
          return (
            <ListItemButton
              key={item.text}
              selected={selected}
              onClick={() => {
                if (item.onClick) return item.onClick();
                if (item.path) return navigate(item.path);
              }}
              sx={{
                mb: 0.5,
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                },
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, cursor: item.onClick ? 'pointer' : 'default' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;