import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { Box, Container, Grid, CircularProgress, Divider, Typography } from '@mui/material';
import ProductInfo from '../../components/product_detail/ProductInfor';
import RelatedProducts from '../../components/product_detail/RelatedProducts';
import ProductGallery from '../../components/product_detail/ProductGallery';
import ProductTabs from '../../components/product_detail/ProductTabs';
import {getProductById, getProducts} from '../../api/user/product';
import { useCart } from '../../contexts/CartContext';

const ProductPageDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProducts] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const currentProduct = await getProductById(id);
            setProducts(currentProduct);
            if (currentProduct && currentProduct.Category_ID)
            {
                const related = await getProducts({ category_id: currentProduct.Category_ID, limit: 5 });
                const allRelated = related.items || related || [];  
                const filteredRelated = allRelated.filter(item => item.ID_Product !== currentProduct.ID_Product);
                setRelatedProducts(filteredRelated);           
            } 
        }
        catch (error) {
            console.error('Error fetching product data:', error);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = (quantity) => {
        if (product) {
            addToCart(product, quantity);
        }
    };
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10, minHeight: '60vh' }}>
                <Typography variant="h5">Không tìm thấy sản phẩm</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 8 }}>
            <Box sx={{ height: { xs: 60, md: 80 } }} /> 
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        
                        <ProductGallery 
                            images={[product.mainImage, ...(product.ProductImages?.map(img => img.URL) || [])].filter(Boolean)} 
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ProductInfo 
                            product={product} 
                            onAddToCart={handleAddToCart} 
                        />
                    </Grid>
                </Grid>
                <Divider sx={{ my: 6 }} />
                <Grid container>
                    <Grid item xs={12} md={10} lg={8}>
                        <ProductTabs description={product.Description} />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6 }} />
                <Box>
                    <RelatedProducts products={relatedProducts} />
                </Box>

            </Container>
        </Box>
    );
}
export default ProductPageDetail;