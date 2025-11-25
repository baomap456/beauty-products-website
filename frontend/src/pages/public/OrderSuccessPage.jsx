import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5'
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 5,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 3
                    }}
                >

                    <CheckCircleOutlineIcon
                        color="success"
                        sx={{ fontSize: 100, mb: 2 }}
                    />

                    <Typography variant="h4" gutterBottom fontWeight="bold" color="success.main">
                        Đặt hàng thành công!
                    </Typography>

                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                        Cảm ơn bạn đã mua sắm tại My Shop. <br />
                        Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/')}
                        >
                            Tiếp tục mua sắm
                        </Button>


                        {/* <Button 
                            variant="outlined" 
                            size="large"
                            onClick={() => navigate('/profile/orders')}
                        >
                            Xem đơn hàng
                        </Button> */}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default OrderSuccessPage;