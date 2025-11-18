import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 240;

const Sidebar = ({ fullname = 'Admin' }) => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  }

  const items = [
    { text: 'Home', path: '/', exact: true, icon: <HomeIcon /> },
    { text: 'Dashboard', path: '/dashboard', exact: true, icon: <DashboardIcon /> },
    { text: 'Products', path: '/dashboard/products', exact: false, icon: <InventoryIcon /> },
    { text: 'Categories', path: '/dashboard/categories', exact: false, icon: <CategoryIcon /> },
    { text: 'Brands', path: '/dashboard/brands', exact: false, icon: <StarIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
      }}
    >
      {/* keep toolbar spacer so drawer sits below fixed AppBar */}
      <Toolbar sx={{ minHeight: 64 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main' }}>{String(fullname).charAt(0).toUpperCase()}</Avatar>
            <Box>
              <Typography variant="subtitle1" noWrap>{fullname}</Typography>
              <Typography variant="caption" color="text.secondary">Admin</Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <List>
            {items.map((item) => (
              <ListItemButton
                key={item.text}
                component={NavLink}
                to={item.path}
                end={item.exact}
                sx={{
                  mb: 0.5,
                  mx: 1,
                  borderRadius: 1,
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' }
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Divider />
        <Box sx={{ p: 1 }}>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;