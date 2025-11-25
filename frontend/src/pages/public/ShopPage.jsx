import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Pagination, Typography, CircularProgress, Toolbar } from '@mui/material';
import { useLocation,useNavigate } from 'react-router-dom';

import ProductFilter from '../../components/shop/ProductFilter';
import ProductCard from '../../components/common/ProductCard';

import { getProducts } from '../../api/user/product';
import { getCategories } from '../../api/user/category';
import { getBrands } from '../../api/user/brand';
import { useCart } from '../../contexts/CartContext';

const ShopPage = () => {
    const location = useLocation();
    const navigate = useNavigate()

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 12;

    const [filters, setFilters] = useState({
        name: '',
        category_id: '',
        brand_id: ''
    });


    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    getCategories(),
                    getBrands()
                ]);
                setCategories(catRes.items || catRes || []);
                setBrands(brandRes.items || brandRes || []);

                const params = new URLSearchParams(location.search);
                const categoryFromUrl = params.get('category');
                const brandFromUrl = params.get('brand');

                if (categoryFromUrl) setFilters(prev => ({ ...prev, category_id: categoryFromUrl }));
                if (brandFromUrl) setFilters(prev => ({ ...prev, brand_id: brandFromUrl }));
            } catch (error) {
                console.error("Error loading meta data", error);
            }
        };
        fetchMeta();
    }, [location.search]);


    useEffect(() => {
        const fetchProductsData = async () => {
            setLoading(true);
            try {
                const params = {
                    page: page,
                    limit: LIMIT,
                    name: filters.name,
                    category_id: filters.category_id,
                    brand_id: filters.brand_id
                };

                const data = await getProducts(params);

                if (data.items) {
                    setProducts(data.items);
                    const total = data.totalCount || data.items.length;
                    setTotalPages(Math.ceil(total / LIMIT));
                } else {
                    setProducts(data);
                }
            } catch (error) {
                console.error("Error fetching products", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchProductsData();
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [filters, page]);


    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    const handleClearFilter = () => {
        setFilters({ name: '', category_id: '', brand_id: '' });
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        alert(`Đã thêm ${product.Name_Product} vào giỏ!`);
    }

    const handleProductClick = (id) => {
        navigate(`/product/${id}`); // Chuyển đến đường dẫn /product/123
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 5 }}>
            <Toolbar />


            <Container maxWidth="xl" sx={{ mt: 3 }}>


                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2, // Khoảng cách giữa 2 cột
                    alignItems: 'flex-start'
                }}>


                    <Box sx={{
                        width: { xs: '100%', md: '250px' },
                        flexShrink: 0,
                        bgcolor: 'white',
                        p: 2,
                        borderRadius: 1
                    }}>
                        <ProductFilter
                            filters={filters}
                            categories={categories}
                            brands={brands}
                            onFilterChange={handleFilterChange}
                            onClearFilter={handleClearFilter}
                        />
                    </Box>


                    <Box sx={{
                        flexGrow: 1,
                        minWidth: 0
                    }}>


                        <Box sx={{ bgcolor: 'white', p: 2, mb: 2, borderRadius: 1 }}>
                            <Typography variant="h6">Kết quả tìm kiếm</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hiển thị {products.length} sản phẩm
                            </Typography>
                        </Box>


                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
                        ) : products.length === 0 ? (
                            <Box sx={{ textAlign: 'center', mt: 5, bgcolor: 'white', p: 5 }}>
                                <Typography variant="h6" color="text.secondary">Không tìm thấy sản phẩm nào.</Typography>
                            </Box>
                        ) : (
                            <>

                                <Grid container spacing={2}>
                                    {products.map((product) => (

                                        <Grid item key={product.ID_Product} xs={12} sm={6} md={4} lg={3}>
                                            <ProductCard
                                            product={product} 
                                            onClick={handleProductClick}
                                            onAddToCart={handleAddToCart}
                                              />
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Phân trang */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        shape="rounded"
                                    />
                                </Box>
                            </>
                        )}
                    </Box>

                </Box>
            </Container>
        </Box>
    );
};

export default ShopPage;