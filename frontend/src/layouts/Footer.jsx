import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 6,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.grey[900], // Màu nền tối
                color: 'white'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Cột 1: Thông tin */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="primary.light" gutterBottom>
                            MY-SHOP
                        </Typography>
                        <Typography variant="body2" color="grey.400">
                            Chúng tôi cung cấp các sản phẩm mỹ phẩm chính hãng chất lượng cao.
                            <br />
                            Địa chỉ: 123 Đường ABC, TP.HCM
                        </Typography>
                    </Grid>

                    {/* Cột 2: Liên kết */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Liên kết
                        </Typography>
                        <Box>
                            <Link href="/" color="inherit" underline="hover">Trang chủ</Link>
                        </Box>
                        <Box>
                            <Link href="/shop" color="inherit" underline="hover">Sản phẩm</Link>
                        </Box>
                        <Box>
                            <Link href="/contact" color="inherit" underline="hover">Liên hệ</Link>
                        </Box>
                    </Grid>

                    {/* Cột 3: Mạng xã hội / Newsletter */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Theo dõi chúng tôi
                        </Typography>
                        <Typography variant="body2" color="grey.400">
                            Facebook | Instagram | TikTok
                        </Typography>
                    </Grid>
                </Grid>

                <Box mt={5}>
                    <Typography variant="body2" color="grey.500" align="center">
                        {'Copyright © '}
                        <Link color="inherit" href="/">
                            My Shop
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;