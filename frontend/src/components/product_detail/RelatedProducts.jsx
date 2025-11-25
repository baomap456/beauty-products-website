import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ProductCard from '../common/ProductCard'; // Tái sử dụng thẻ sản phẩm có sẵn

const RelatedProducts = ({ products }) => {
    // Nếu không có sản phẩm liên quan nào, ẩn luôn component này
    if (!products || products.length === 0) return null;

    return (
        <Box sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                Sản phẩm liên quan
            </Typography>
            
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item key={product.ID_Product} xs={12} sm={6} md={4} lg={3}>
                        <ProductCard 
                            product={product} 
                            // onClick={() => ...} // Nếu muốn xử lý click chuyển trang
                            // onAddToCart={() => ...} // Nếu muốn nút thêm nhanh
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default RelatedProducts;