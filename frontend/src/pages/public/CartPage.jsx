import React from 'react';
import { getCart, updateCartItem, deleteCartItem, deleteCart } from '../../api/user/cart';
import { Box, Container, Grid, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Components
import CartList from '../../components/cart/CartList';
import CartSummary from '../../components/cart/CartSummary';
import { useCart } from '../../contexts/CartContext';
const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [cartTotal, setCartTotal] = React.useState(0);
    const { fetchCart } = useCart();

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const data = await getCart(); // Giả sử hàm này đã được định nghĩa để lấy giỏ hàng
            setCartItems(data.items || []);
            setCartTotal(data.Total || 0);

        }
        catch (error) {
            console.error("Lỗi tải giỏ hàng:", error);
            setError("Không thể tải giỏ hàng");
        }
        finally {
            setLoading(false);
        }
    }
    React.useEffect(() => {
        fetchCartItems();
    }, [])

    const handleRemoveItem = async (itemId) => {
        try {
            if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
            await deleteCartItem(itemId);
            setCartItems(prevItems => prevItems.filter(item => item.ID_CartItem !== itemId));
            fetchCart();
        }
        catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
        }
    }

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        try {
            setCartItems(prevItems => prevItems.map(item => {
                if (item.ID_CartItem === itemId) {
                    return { ...item, Quantity: newQuantity };
                }
                return item;
            }));
            await updateCartItem(itemId, newQuantity);
            fetchCart();
        }
        catch (error) {
            console.error("Lỗi cập nhật số lượng:", error);
        }
    }

    const handleClearCart = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) return;
        try {
            await deleteCart();
            setCartItems([]);
            setCartTotal(0);
        }
        catch (error) {
            console.error("Lỗi xóa toàn bộ giỏ hàng:", error);
        }
    }

    const handleCheckout = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Nếu chưa đăng nhập -> Chuyển qua Login, kèm state để quay lại
            navigate('/login', { state: { from: '/cart' } });
        } else {
            // Nếu rồi -> Chuyển qua trang thanh toán
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

                {cartItems.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h6" color="text.secondary">Giỏ hàng đang trống</Typography>
                        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/shop')}>
                            Tiếp tục mua sắm
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>

                        {/* CỘT TRÁI: DANH SÁCH (CartList) */}
                        <Grid item xs={12} md={8}>
                            <CartList
                                items={cartItems}
                                onUpdate={handleUpdateQuantity}
                                onRemove={handleRemoveItem}
                            />
                            {/* Nút xóa hết (Tùy chọn) */}
                            <Button color="error" onClick={handleClearCart} sx={{ mt: 2 }}>Xóa tất cả</Button>
                        </Grid>

                        {/* CỘT PHẢI: TỔNG TIỀN (CartSummary) */}
                        <Grid item xs={12} md={4}>
                            {/* Bạn phải tính tổng tiền ở đây nếu API chưa trả về Total chuẩn */}
                            <CartSummary
                                total={cartItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0)}

                                checkOut={handleCheckout}
                            />
                        </Grid>

                    </Grid>
                )}
            </Container>
        </Box>
    )


}

export default CartPage;