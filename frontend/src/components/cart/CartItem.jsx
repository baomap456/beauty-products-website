import React from 'react';
import {
    Card,
    Grid,
    Typography,
    Box,
    TextField,
    IconButton,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ cartItem, onUpdateQuantity, onRemoveItem }) => {
    const { ID_CartItem, Name_Product, Price, Quantity, Image } = cartItem;

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity >= 1) {
            onUpdateQuantity(ID_CartItem, newQuantity);
        }
    };

    return (
        <Card sx={{ mb: 2, p: 2, boxShadow: 1 }}>
            {/* alignItems="center": Căn giữa theo chiều dọc (trên/dưới) */}
            <Grid container spacing={2} alignItems="center">

                {/* 1. SẢN PHẨM (xs=5) - Căn Trái */}
                <Grid item xs={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            component="img"
                            sx={{
                                width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2,
                                flexShrink: 0, border: '1px solid #eee'
                            }}
                            alt={Name_Product}
                            src={Image || 'https://via.placeholder.com/60'}
                        />
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap title={Name_Product}>
                                {Name_Product}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Price)}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* 2. SỐ LƯỢNG (xs=3) - Căn Giữa */}
                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        type="number"
                        size="small"
                        // ❌ ĐÃ XÓA DÒNG label="Số lượng" để ô nhập gọn gàng và thẳng hàng
                        value={Quantity}
                        onChange={handleQuantityChange}
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                        sx={{ width: '60px' }} // Cố định chiều rộng ô nhập
                    />
                </Grid>

                {/* 3. THÀNH TIỀN (xs=3) - Căn Giữa */}
                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Price * Quantity)}
                    </Typography>
                </Grid>

                {/* 4. NÚT XÓA (xs=1) - Căn Phải */}
                <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title="Xóa">
                        <IconButton color="error" onClick={() => onRemoveItem(ID_CartItem)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

            </Grid>
        </Card>
    );
}

export default CartItem;