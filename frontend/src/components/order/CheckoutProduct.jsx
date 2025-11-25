import React from 'react';

import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, Divider } from '@mui/material';
const CheckoutProduct = ({ products }) => {
    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Sản phẩm ({products.length})
            </Typography>

            <List disablePadding>
                {products.map((item, index) => (
                    <React.Fragment key={item.ID_CartItem || index}>
                        <ListItem sx={{ py: 2, px: 0 }}>
                            {/* Ảnh sản phẩm */}
                            <ListItemAvatar>
                                <Avatar
                                    variant="rounded"
                                    src={item.Image || item.mainImage || 'https://via.placeholder.com/64'}
                                    alt={item.Name_Product}
                                    sx={{ width: 64, height: 64, mr: 2, border: '1px solid #eee' }}
                                />
                            </ListItemAvatar>

                            {/* Tên và Số lượng */}
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                        {item.Name_Product}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        Số lượng: <Box component="span" fontWeight="bold">x{item.Quantity}</Box>
                                    </Typography>
                                }
                            />

                            {/* Thành tiền */}
                            <Typography variant="body2" fontWeight="bold" color="primary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Price * item.Quantity)}
                            </Typography>
                        </ListItem>

                        {/* Đường kẻ ngăn cách, trừ item cuối cùng */}
                        {index < products.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
}

export default CheckoutProduct;