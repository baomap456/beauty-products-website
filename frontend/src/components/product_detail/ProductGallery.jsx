import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper } from '@mui/material';

const ProductGallery = ({ images = [] }) => {
    // --- 1. STATE: LƯU ẢNH ĐANG ĐƯỢC CHỌN ---
    // Khởi tạo bằng ảnh đầu tiên trong danh sách (images[0])
    // Nếu không có ảnh nào thì dùng chuỗi rỗng ''
    const [selectedImage, setSelectedImage] = useState(images[0] || '');

    // --- 2. EFFECT: ĐỒNG BỘ KHI ĐỔI SẢN PHẨM ---
    // Khi người dùng chuyển từ Sản phẩm A sang Sản phẩm B,
    // prop "images" sẽ thay đổi. Ta cần reset ảnh to về cái đầu tiên của B.
    useEffect(() => {
        if (images && images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [images]); // Chạy lại mỗi khi danh sách 'images' thay đổi

    // --- 3. XỬ LÝ ẢNH LỖI (FALLBACK) ---
    // Nếu không có ảnh nào, dùng ảnh giữ chỗ (placeholder)
    const mainImgSrc = selectedImage || 'https://via.placeholder.com/500x500?text=No+Image';

    return (
        <Box>
            {/* --- PHẦN 1: ẢNH LỚN (MAIN IMAGE) --- */}
            <Paper 
                elevation={2} 
                sx={{ 
                    mb: 2, 
                    p: 1, 
                    borderRadius: 2,
                    height: '450px', // Cố định chiều cao khung ảnh
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    bgcolor: '#fff'
                }}
            >
                <Box
                    component="img"
                    src={mainImgSrc}
                    alt="Product Main"
                    sx={{
                        width: '100%',
                        height: '100%',
                        // QUAN TRỌNG: object-fit: 'contain'
                        // Giúp ảnh luôn hiển thị trọn vẹn, không bị cắt, không bị méo
                        // dù ảnh là hình chữ nhật hay hình vuông.
                        objectFit: 'contain' 
                    }}
                />
            </Paper>

            {/* --- PHẦN 2: DANH SÁCH ẢNH NHỎ (THUMBNAILS) --- */}
            <Grid container spacing={2}>
                {images.map((img, index) => (
                    <Grid item key={index} xs={3}>
                        <Box
                            component="img"
                            src={img}
                            alt={`Thumbnail ${index}`}
                            // Sự kiện click: Cập nhật state selectedImage
                            onClick={() => setSelectedImage(img)}
                            sx={{
                                width: '100%',
                                height: '80px',
                                objectFit: 'cover', // Ảnh nhỏ thì cho cắt (cover) để vuông vức đẹp mắt
                                borderRadius: 2,
                                cursor: 'pointer',
                                border: selectedImage === img ? '2px solid #1976d2' : '1px solid #eee', // Viền xanh nếu đang chọn
                                opacity: selectedImage === img ? 1 : 0.7, // Làm mờ nhẹ nếu chưa chọn
                                transition: 'all 0.2s',
                                '&:hover': {
                                    opacity: 1,
                                    border: '2px solid #1976d2'
                                }
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProductGallery;