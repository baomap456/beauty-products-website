import React, { useState } from 'react';
import { Paper, Typography, Box, Divider, TextField, Button, InputAdornment } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const OrderSummary = ({ cartTotal, shippingFee, discountAmount, onPlaceOrder }) => {
    const [couponCode, setCouponCode] = useState('');
    const finalTotal = cartTotal + shippingFee - discountAmount;

    const handleApplyCoupon = () => {
        alert(`Tính năng áp dụng mã "${couponCode}" đang phát triển!`);
    }

    return (
        <Paper sx={{ p: 3, position: 'sticky', top: '80px', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Tổng kết đơn hàng</Typography>

            {/* Nhập Voucher */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, mt: 2 }}>
                <TextField
                    size="small"
                    placeholder="Mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocalOfferIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="outlined" onClick={handleApplyCoupon} sx={{ minWidth: '80px' }}>
                    Áp dụng
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Tính toán */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Tạm tính:</Typography>
                <Typography fontWeight="medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Phí vận chuyển:</Typography>
                <Typography fontWeight="medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}
                </Typography>
            </Box>

            {/* Chỉ hiện dòng giảm giá nếu có */}
            {discountAmount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, color: 'success.main' }}>
                    <Typography>Giảm giá:</Typography>
                    <Typography fontWeight="bold">
                        -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}
                    </Typography>
                </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'flex-end' }}>
                <Typography variant="h6">Tổng cộng:</Typography>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" color="error" fontWeight="bold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">(Đã bao gồm VAT)</Typography>
                </Box>
            </Box>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={onPlaceOrder}
                sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
            >
                ĐẶT HÀNG
            </Button>
        </Paper>
    );
}


export default OrderSummary;