import React, { useState,useEffect } from 'react';
import { Box, Grid, Toolbar } from '@mui/material';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import StatCard from '../../components/admin/StatCard';
import {getProfile} from '../../api/auth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user profile from backend
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();
          setUser(response.user);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const [stats] = useState({
    orders: 124,
    users: 89,
    products: 56,
    revenue: 12540,
  });

  const [chartData] = useState([
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1500 },
    { month: 'Mar', revenue: 1800 },
    { month: 'Apr', revenue: 2000 },
    { month: 'May', revenue: 2200 },
    { month: 'Jun', revenue: 1840 },
  ]);

  

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar fullname={user?.FullName || ''} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Orders" value={stats.orders} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Users" value={stats.users} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Products" value={stats.products} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Revenue" value={`$${stats.revenue}`} /></Grid>
        </Grid>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
