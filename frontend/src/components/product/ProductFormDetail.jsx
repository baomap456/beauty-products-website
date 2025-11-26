import React from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Chip, 
    Divider,
    Avatar
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const ProductDetail = ({ product,onClose }) => {
    if (!product) return null;

    // Xử lý hiển thị ảnh (nếu không có thì dùng ảnh placeholder)
    const imageUrl = product.mainImage || product.Image || 'https://via.placeholder.com/300';

    // Hàm format tiền tệ
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };
    return (
        <>
            {/* 1. Tiêu đề */}
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                Chi tiết sản phẩm #{product.ID_Product}
            </DialogTitle>

            {/* 2. Nội dung chính */}
            <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    
                    {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
                    <Grid item xs={12} md={5}>
                        <Box 
                            sx={{ 
                                border: '1px solid #eee', 
                                borderRadius: 2, 
                                overflow: 'hidden',
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                height: '300px',
                                bgcolor: '#f9f9f9'
                            }}
                        >
                            <Box
                                component="img"
                                src={imageUrl}
                                alt={product.Name_Product}
                                sx={{ 
                                    maxWidth: '100%', 
                                    maxHeight: '100%', 
                                    objectFit: 'contain' 
                                }}
                            />
                        </Box>
                        
                        {/* Nếu có ảnh phụ thì hiển thị ở đây (Optional) */}
                        {/* <Box sx={{ mt: 1, display: 'flex', gap: 1, overflowX: 'auto' }}>
                            {product.secondaryImages?.map((img, index) => (
                                <Avatar key={index} src={img} variant="rounded" sx={{ width: 50, height: 50 }} />
                            ))}
                        </Box> */}
                    </Grid>

                    {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {product.Name_Product}
                        </Typography>

                        {/* Giá & Tồn kho */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 1 }}>
                            <Chip 
                                icon={<AttachMoneyIcon />} 
                                label={formatPrice(product.Price)} 
                                color="error" 
                                variant="outlined" 
                                sx={{ fontWeight: 'bold', fontSize: '1rem', px: 1 }}
                            />
                            <Chip 
                                icon={<InventoryIcon />} 
                                label={`Tồn kho: ${product.Stock}`} 
                                color={product.Stock > 0 ? "success" : "default"} 
                                variant="outlined"
                            />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Danh mục & Thương hiệu */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CategoryIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Danh mục</Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {product.Category?.Name_Category || "N/A"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BrandingWatermarkIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Thương hiệu</Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {product.Brand?.Name_Brand || "N/A"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ mb: 2 }} />

                        {/* Mô tả */}
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Mô tả:
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                                whiteSpace: 'pre-line', // Giữ nguyên xuống dòng
                                maxHeight: '200px', 
                                overflowY: 'auto',
                                bgcolor: '#f5f5f5',
                                p: 2,
                                borderRadius: 1
                            }}
                        >
                            {product.Description || "Không có mô tả nào."}
                        </Typography>

                    </Grid>
                </Grid>
            </DialogContent>

            {/* 3. Nút đóng */}
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="contained" color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </>
    );
}

export default ProductDetail;