import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Button } from '@mui/material';
const CartSummary = ({ total, checkOut }) => {
    const formattedTotal = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(total);
    return (
        <Card sx={{ p: 2, position: 'sticky', top: '100px', boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Tổng tiền giỏ hàng
                </Typography>

                {/* Tạm tính */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                        Tạm tính:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                        {formattedTotal}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Tổng cộng */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">
                        Tổng cộng:
                    </Typography>
                    <Typography variant="h5" color="error" fontWeight="bold">
                        {formattedTotal}
                    </Typography>
                </Box>

                {/* Nút thanh toán */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={checkOut}
                    sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                >
                    Tiến hành đặt hàng
                </Button>
            </CardContent>
        </Card>
    );
}

export default CartSummary;