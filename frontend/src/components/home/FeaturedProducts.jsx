import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ProductCard from '../common/ProductCard';
import Slider from "react-slick";

// Tùy chỉnh nút mũi tên (Optional - để đẹp hơn mặc định)
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const FeaturedProducts = ({ products, onProductClick, onAddToCart }) => {

    // Cấu hình cho Slider
    const settings = {
        dots: true,             // Hiển thị chấm tròn bên dưới
        infinite: false,        // Không lặp lại vô tận (để người dùng biết điểm dừng)
        speed: 500,             // Tốc độ trượt
        slidesToShow: 4,        // Hiển thị 4 sản phẩm trên màn hình PC
        slidesToScroll: 1,      // Mỗi lần bấm trượt 1 cái
        initialSlide: 0,
        responsive: [           // Cấu hình cho các màn hình nhỏ hơn
            {
                breakpoint: 1024, // Laptop nhỏ / Tablet ngang
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600, // Tablet dọc / Điện thoại to
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480, // Điện thoại nhỏ
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
                Sản Phẩm Nổi Bật
            </Typography>

            {/* Bọc Slider trong Box để chỉnh padding tránh bị cắt bóng đổ */}
            <Box sx={{ px: 2, pb: 3 }}>
                <Slider {...settings}>
                    {products.map((product) => (
                        // Slider cần key ở thẻ bao ngoài cùng bên trong nó
                        <Box key={product.ID_Product} sx={{ p: 1 }}> {/* p:1 tạo khoảng cách giữa các thẻ */}
                            <ProductCard
                                product={product}
                                onClick={onProductClick}
                                onAddToCart={onAddToCart}
                            />
                        </Box>
                    ))}
                </Slider>
            </Box>
        </Container>
    );
};

export default FeaturedProducts;