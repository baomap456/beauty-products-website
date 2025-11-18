import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";

const BrandList = ({ brands }) => {
    const navigate = useNavigate();

    if (!brands || brands.length === 0) return null;

    const settings = {
        dots: false,        // Brand thường không cần dots
        infinite: true,     // Cho phép lặp vô tận
        speed: 500,
        slidesToShow: 6,    // 6 thương hiệu 1 hàng
        slidesToScroll: 2,
        autoplay: true,     // Tự động chạy
        autoplaySpeed: 3000,
        rows: 2,            // <--- 2 Hàng
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 4, slidesToScroll: 2, rows: 2 }
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 3, slidesToScroll: 1, rows: 2 }
            }
        ]
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', py: 6, my: 4 }}>
            <Container>
                <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Thương Hiệu Đồng Hành
                </Typography>
                <Box sx={{ px: 3 }}> {/* Padding để chừa chỗ cho nút mũi tên */}
                    <Slider {...settings}>
                        {brands.map((brand) => (
                            <Box key={brand.ID_Brand} sx={{ p: 1 }}>
                                <Paper
                                    elevation={0}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        height: 60, // Chiều cao cố định
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                                    }}
                                    onClick={() => navigate(`/shop?brand=${brand.ID_Brand}`)}
                                >
                                    <Typography variant="button" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                        {brand.Name_Brand}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Container>
        </Box>
    );
};

export default BrandList;