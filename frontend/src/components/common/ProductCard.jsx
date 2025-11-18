import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

// Component này cực "Ngu", chỉ nhận 1 product và hiển thị
const ProductCard = ({ product, onAddToCart, onClick }) => {
    // Xử lý ảnh: Nếu không có ảnh, dùng ảnh mặc định
    const imageUrl = product.mainImage
        ? `http://localhost:5000/${product.mainImage}`
        : 'https://via.placeholder.com/300'; // Ảnh placeholder

    return (
        <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="200"
                image={imageUrl}
                alt={product.Name_Product}
                sx={{ cursor: 'pointer' }}
                onClick={() => onClick(product.ID_Product)}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" onClick={() => onClick(product.ID_Product)} sx={{ cursor: 'pointer' }}>
                    {product.Name_Product}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.Category?.Name_Category}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.Price)}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" variant="contained" fullWidth onClick={() => onAddToCart(product)}>
                    Thêm vào giỏ
                </Button>
            </CardActions>
        </Card>
    );
};
export default ProductCard;