import React, { useState } from 'react';
import { 
    Box, Typography, Button, Stack, TextField, Divider, Chip, Rating 
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductInfor = ({product, addToCart}) => {
    const [quantity, setquantiry] = useState(1);

    const handleQuantityChange = (e) => {
        const val = parseInt(e.target.value, 10);

        if (!isNaN(val) && val > 1) {
            setquantiry(val);
        }
    }

    const handleAddToCartClick = () => {
        addToCart(product, quantity);
    }


    return (
        <Box>
           
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                {product.Name_Product}
            </Typography>

           
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Rating value={4.5} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">(Review demo)</Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body2">
                    Thương hiệu: <b>{product.Brand?.Name_Brand || 'Đang cập nhật'}</b>
                </Typography>
            </Stack>

            
            <Typography variant="h4" color="error.main" fontWeight="bold" sx={{ mb: 3 }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.Price)}
            </Typography>

            <Box sx={{ my: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Danh mục:</Typography>
                <Chip label={product.Category?.Name_Category || 'General'} color="primary" variant="outlined" />
            </Box>

            <Divider sx={{ my: 3 }} />

            
            <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                    label="Số lượng"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: product.Stock } }} // Giới hạn min/max
                    sx={{ width: 100 }}
                />
                
                <Button 
                    variant="contained" 
                    size="large" 
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCartClick}
                    disabled={product.Stock <= 0}
                    sx={{ px: 4, py: 1 }}
                >
                    {product.Stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                </Button>
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Còn lại: {product.Stock} sản phẩm
            </Typography>
        </Box>
    );
}

export default ProductInfor;