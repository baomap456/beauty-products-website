import { Box, Typography, Button, Container } from '@mui/material';

const HeroBanner = ({ onShopNow }) => {
    return (
        <Box sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 8,
            mb: 4,
            textAlign: 'center'
        }}>
            <Container maxWidth="md">
                <Typography variant="h2" component="h1" gutterBottom>
                    Chào mừng đến với Cửa hàng Mỹ Phẩm
                </Typography>
                <Typography variant="h5" paragraph>
                    Khám phá vẻ đẹp tự nhiên với các sản phẩm tốt nhất từ chúng tôi.
                </Typography>
                <Button variant="contained" color="secondary" size="large" onClick={onShopNow}>
                    Mua Ngay
                </Button>
            </Container>
        </Box>
    );
};
export default HeroBanner;