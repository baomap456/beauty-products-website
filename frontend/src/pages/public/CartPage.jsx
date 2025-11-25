import React, {useEffect, useState} from 'react';
import { Box, Container, Grid, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Components
import CartList from '../../components/cart/CartList';
import CartSummary from '../../components/cart/CartSummary';
import { useCart } from '../../contexts/CartContext';
const CartPage = () => {
    const navigate = useNavigate();
    const { 
        cartItems, 
        cartTotal, 
        updateQuantity, 
        removeFromCart, 
        clearCart,
        fetchCart,
        loading,
        error,
    } = useCart();
    React.useEffect(() => {
        fetchCart();
    }, [])

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        await updateQuantity(itemId, newQuantity);
    };

    const handleRemoveItem = async (itemId) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            await removeFromCart(itemId);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
            await clearCart();
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box sx={{ mt: 5 }}><Alert severity="error">{error}</Alert></Box>;
    }

    const handleCheckout = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Chưa đăng nhập -> Chuyển qua Login
            navigate('/login', { state: { from: '/cart' } });
        } else {
            // Đã đăng nhập -> Chuyển qua Checkout
            navigate('/addresses');
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box sx={{ mt: 5 }}><Alert severity="error">{error}</Alert></Box>;
    }

   return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 5, pt: 2 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Giỏ hàng của bạn
                </Typography>

                {(!cartItems || cartItems.length === 0) ? (
                    <Box sx={{ textAlign: 'center', py: 5, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h6" color="text.secondary">Giỏ hàng đang trống</Typography>
                        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/shop')}>
                            Tiếp tục mua sắm
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        
                        {/* CỘT TRÁI: DANH SÁCH */}
                        <Grid item xs={12} md={8}>
                            <CartList 
                                items={cartItems} 
                                onUpdate={handleUpdateQuantity} 
                                onRemove={handleRemoveItem} 
                            />
                            <Button color="error" onClick={handleClearCart} sx={{ mt: 2 }}>Xóa tất cả</Button>
                        </Grid>

                        {/* CỘT PHẢI: TỔNG TIỀN */}
                        <Grid item xs={12} md={4}>
                            <CartSummary 
                                total={cartTotal} 
                                checkOut={handleCheckout} 
                            />
                        </Grid>

                    </Grid>
                )}
            </Container>
        </Box>
    );


}

export default CartPage;