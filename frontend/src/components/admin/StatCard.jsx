import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ title, value }) => (
  <Card sx={{ minWidth: 200, textAlign: 'center' }}>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4" fontWeight="bold">{value}</Typography>
    </CardContent>
  </Card>
);

export default StatCard;