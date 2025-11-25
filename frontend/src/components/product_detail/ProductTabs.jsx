import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const ProductTabs = ({description}) => {
    return (
        <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                Mô tả sản phẩm
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography 
                variant="body1" 
                sx={{ 
                    whiteSpace: 'pre-line', 
                    lineHeight: 1.8,        
                    color: 'text.secondary'
                }}
            >
                {description || "Sản phẩm này chưa có mô tả chi tiết."}
            </Typography>
        </Paper>
    );
}

export default ProductTabs;