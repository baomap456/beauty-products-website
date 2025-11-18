import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Import các Dumb Components
import HeroBanner from '../../components/home/HeroBanner';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import CategoryGrid from '../../components/home/CategoryGrid';
import BrandList from '../../components/home/BrandList';
// import Navbar from '../../components/layout/Navbar'; // Navbar chung cho khách

// Import API
import { getProducts } from '../../api/user/product';
import { getCategories } from '../../api/user/category'
import { getBrands } from '../../api/user/brand';

const HomePage = () => {
    const navigate = useNavigate();

    // 1. State quản lý dữ liệu
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Gọi API khi trang tải
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Gọi song song để nhanh hơn
                const [productsData, categoriesData, brandsData] = await Promise.all([
                    getProducts(),   // Có thể backend bạn hỗ trợ ?limit=8 để lấy 8 cái thôi
                    getCategories(),
                    getBrands()
                ]);

                // Xử lý dữ liệu nếu API trả về { items: [] }
                setProducts(productsData.items || productsData);
                setCategories(categoriesData.items || categoriesData);
                setBrands(brandsData.items || brandsData);
            } catch (error) {
                console.error("Lỗi tải trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 3. Các hàm xử lý sự kiện (Handlers)
    const handleShopNow = () => {
        navigate('/shop'); // Chuyển đến trang tất cả sản phẩm
    };

    const handleProductClick = (id) => {
        navigate(`/product/${id}`); // Chuyển đến trang chi tiết sản phẩm
    };

    const handleAddToCart = (product) => {
        console.log("Thêm vào giỏ:", product);
        // Logic Redux hoặc Context API để thêm vào giỏ hàng sẽ viết ở đây
        alert(`Đã thêm ${product.Name_Product} vào giỏ!`);
    };

    // 4. Render
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            {/* Navbar dành cho khách (Khác với Admin Navbar) */}
            {/* <Navbar /> */}

            {/* Banner to đẹp */}
            <HeroBanner onShopNow={handleShopNow} />

            <CategoryGrid categories={categories} />
            {/* Danh sách sản phẩm */}
            {/* Bạn có thể lọc lấy 4-8 sản phẩm đầu tiên để hiển thị ở Home */}
            <FeaturedProducts
                products={products.slice(0, 8)}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
            />

            <BrandList brands={brands} />
            {/* Footer sẽ nằm ở đây */}
        </Box>
    );
};

export default HomePage;