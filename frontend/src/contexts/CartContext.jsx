import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addItem } from '../api/user/cart'; // Import API của bạn

// 1. Tạo Context
const CartContext = createContext();

// 2. Tạo Provider
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    // Kiểm tra đã đăng nhập chưa
    const isLoggedIn = !!localStorage.getItem('token');

    // --- HÀM LẤY DỮ LIỆU GIỎ HÀNG ---
    const fetchCart = async () => {
        if (isLoggedIn) {
            // A. Đã đăng nhập: Lấy từ Server
            try {
                const data = await getCart();
                // Giả sử API trả về { items: [], Total: 0 } (đã làm phẳng)
                setCartItems(data.items || []);
                setCartTotal(data.Total || 0);
            } catch (error) {
                console.error("Lỗi tải giỏ hàng:", error);
            }
        } else {
            // B. Chưa đăng nhập: Lấy từ LocalStorage
            const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartItems(localCart);
            // Tự tính tổng tiền cho Local Cart
            const total = localCart.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
            setCartTotal(total);
        }
    };

    // Chạy 1 lần khi load trang hoặc khi trạng thái login thay đổi
    useEffect(() => {
        fetchCart();
    }, [isLoggedIn]);

    // --- HÀM THÊM VÀO GIỎ ---
    const addToCart = async (product, quantity = 1) => {
        if (isLoggedIn) {
            // A. Đã đăng nhập: Gọi API
            try {
                await addItem({
                    productId: product.ID_Product, // Hoặc product.id tùy dữ liệu
                    quantity: quantity
                });
                // Sau khi thêm thành công, tải lại giỏ để cập nhật số lượng mới nhất
                await fetchCart();
            } catch (error) {
                console.error("Lỗi thêm vào giỏ:", error);
                alert("Lỗi thêm vào giỏ hàng!");
            }
        } else {
            // B. Chưa đăng nhập: Lưu LocalStorage
            const newCart = [...cartItems];
            const existingItemIndex = newCart.findIndex(item => item.ID_Product === product.ID_Product);

            if (existingItemIndex > -1) {
                // Sản phẩm đã có -> Tăng số lượng
                newCart[existingItemIndex].Quantity += quantity;
            } else {
                // Sản phẩm chưa có -> Thêm mới
                // Lưu ý: Phải map đúng tên trường giống backend trả về để tái sử dụng component CartItem
                newCart.push({
                    ID_CartItem: Date.now(), // ID giả
                    ID_Product: product.ID_Product,
                    Name_Product: product.Name_Product,
                    Price: product.Price,
                    Image: product.mainImage || product.Image, // Lưu ảnh
                    Quantity: quantity
                });
            }

            setCartItems(newCart);
            localStorage.setItem('cartItems', JSON.stringify(newCart));

            // Tính lại tổng tiền
            const total = newCart.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
            setCartTotal(total);

        }
    };

    const cartCount = cartItems.reduce((total, item) => {
        return total + (parseInt(item.Quantity) || 0);
    }, 0);

    // Giá trị chia sẻ cho toàn bộ app
    const value = {
        cartItems,
        cartTotal,
        addToCart,
        fetchCart, // Để gọi lại khi cần (ví dụ sau khi xóa)
        cartCount // Số lượng loại sản phẩm (hoặc dùng reduce để tính tổng số item)
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook custom để dùng nhanh
export const useCart = () => {
    return useContext(CartContext);
};