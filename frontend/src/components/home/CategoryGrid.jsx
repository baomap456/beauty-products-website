import React from 'react';
import { Box, Typography, Container, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";

const CategoryGrid = ({ categories }) => {
    const navigate = useNavigate();

    if (!categories || categories.length === 0) return null;

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,    // 5 cột
        slidesToScroll: 5,  // Trượt nguyên 1 trang
        rows: 2,            // <--- QUAN TRỌNG: Hiển thị 2 hàng
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 4, slidesToScroll: 4, rows: 2 }
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 3, slidesToScroll: 3, rows: 2 }
            }
        ]
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
                Danh Mục
            </Typography>

            <Box sx={{ px: 2 }}>
                <Slider {...settings}>
                    {categories.map((category) => (
                        <Box key={category.ID_Category} sx={{ p: 1 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    '&:hover': { '& .MuiAvatar-root': { transform: 'scale(1.1)', boxShadow: 3 } }
                                }}
                                onClick={() => navigate(`/shop?category=${category.ID_Category}`)}
                            >
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        mb: 1,
                                        bgcolor: 'primary.light',
                                        fontSize: '1.5rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {category.Name_Category.charAt(0)}
                                </Avatar>
                                <Typography variant="caption" align="center" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                                    {category.Name_Category}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Slider>
            </Box>
        </Container>
    );
};

export default CategoryGrid;