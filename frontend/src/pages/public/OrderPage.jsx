import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutAddress from '../../components/order/CheckoutAddress';
import CheckoutProduct from '../../components/order/CheckoutProduct';
import PaymentMethod from '../../components/order/PaymentMethod';
import OrderSummary from '../../components/order/OrderSummary';
import { createOrder } from '../../api/user/order';
import { useCart } from '../../contexts/CartContext';

const OrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [address, setAddress] = useState(location.state?.shippingAddress || null);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // Mặc định COD
    const [discount, setDiscount] = useState(0); // Số tiền giảm giá
    const [discountId, setDiscountId] = useState(null); // ID mã giảm giá (để gửi backend)
    const [loading, setLoading] = useState(false);

    const SHIPPING_FEE = 30000; // Phí ship cố định (hoặc tính động)
    const { cartItems, cartTotal, fetchCart } = useCart();

    useEffect(() => {
        if (!address) {
            navigate('/address'); // Bỏ comment dòng này để chặn truy cập trực tiếp
        }
    }, [address, navigate]);

    const handleChangeAddress = () => {
        navigate('/address'); // Quay lại trang chọn địa chỉ
    };

    const handleApplyCoupon = async (code) => {
        if (!code) return;
        try {
            // Gọi API check voucher (giả sử)
            // const data = await checkVoucher(code, cartTotal);
            // setDiscount(data.amount);
            // setDiscountId(data.id);

            // Giả lập thành công
            if (code === "SALE50") {
                setDiscount(50000);
                setDiscountId(1);
                alert("Áp dụng mã giảm giá 50k thành công!");
            } else {
                alert("Mã giảm giá không tồn tại");
                setDiscount(0);
                setDiscountId(null);
            }
        } catch (error) {
            alert("Lỗi áp dụng mã giảm giá");
        }
    };

    const handlePlaceOrder = async () => {
        if (!address) {
            alert("Vui lòng chọn địa chỉ giao hàng!");
            return;
        }

        setLoading(true);
        try {
            // Chuẩn bị payload gửi lên Backend (khớp với order.service.js của bạn)
            const payload = {
                addressId: address.ID_Address,
                discountId: discountId,
                paymentPayload: {
                    PaymentMethod: paymentMethod,
                    Amount: cartTotal + SHIPPING_FEE - discount, // Tổng tiền cuối cùng
                    Status: paymentMethod === 'COD' ? 'Pending' : 'Waiting Payment'
                }
            };

            // Gọi API tạo đơn hàng
            const result = await createOrder(payload);

            // Thành công
            console.log("Order Created:", result);

            // Reset giỏ hàng (quan trọng: gọi fetchCart để context tự làm mới về 0)
            await fetchCart();

            // Chuyển hướng đến trang Thành công hoặc Thanh toán Online
            if (paymentMethod === 'VNPAY') {
                // Nếu có URL thanh toán trả về từ API
                // window.location.href = result.paymentUrl; 
                alert("Chức năng thanh toán VNPAY đang phát triển. Đơn hàng đã được tạo.");
                navigate('/order-success');
            } else {
                navigate('/order-success'); // Trang cảm ơn
            }

        } catch (error) {
            console.error("Order Error:", error);
            alert(error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Đang xử lý đơn hàng...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                Thanh Toán
            </Typography>

            <Grid container spacing={3}>

                {/* --- CỘT TRÁI (Thông tin chi tiết) --- */}
                <Grid item xs={12} md={8}>

                    {/* 1. Địa chỉ */}
                    <CheckoutAddress
                        address={address}
                        onChange={handleChangeAddress}
                    />

                    {/* 2. Danh sách sản phẩm */}
                    <CheckoutProduct
                        products={cartItems}
                    />

                    {/* 3. Phương thức thanh toán */}
                    <PaymentMethod
                        method={paymentMethod}
                        onChange={setPaymentMethod}
                    />

                </Grid>

                {/* --- CỘT PHẢI (Tổng kết & Đặt hàng) --- */}
                <Grid item xs={12} md={4}>

                    {/* 4. Bảng tính tiền */}
                    <OrderSummary
                        cartTotal={cartTotal}
                        shippingFee={SHIPPING_FEE}
                        discountAmount={discount}
                        onApplyCoupon={handleApplyCoupon}
                        onPlaceOrder={handlePlaceOrder}
                    />

                </Grid>

            </Grid>
        </Container>
    );
}

export default OrderPage;