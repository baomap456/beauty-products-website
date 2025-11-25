import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addItem,mergeCarts,deleteCart,deleteCartItem } from '../api/user/cart'; // Import API của bạn


const CartContext = createContext();


export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    
    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            if (localCart.length > 0) {
                try {
                    
                    const itemsToMerge = localCart.map(item => ({
                        Product_ID: item.ID_Product || item.id,
                        Quantity: item.Quantity || item.quantity
                    }));
                    
                    
                    await mergeCarts(itemsToMerge);
                    
                    
                    localStorage.removeItem('cartItems');
                } catch (err) {
                    console.error("Lỗi tự động gộp giỏ hàng:", err);
                    
                }
            }
            
            try {
                const data = await getCart();
               
                setCartItems(data.items || []);
                setCartTotal(data.Total || 0);
            } catch (error) {
                console.error("Lỗi tải giỏ hàng:", error);
            }
        } else {
           
            const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartItems(localCart);
            
            const total = localCart.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
            setCartTotal(total);
        }
    };

    
    useEffect(() => {
        fetchCart();
    }, []);

    
    const addToCart = async (product, quantity = 1) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await addItem({
                    productId: product.ID_Product,
                    quantity: quantity
                });
               
                await fetchCart();
            } catch (error) {
                console.error("Lỗi thêm vào giỏ:", error);
                alert("Lỗi thêm vào giỏ hàng!");
            }
        } else {
           
            const newCart = [...cartItems];
            const existingItemIndex = newCart.findIndex(item => item.ID_Product === product.ID_Product);

            if (existingItemIndex > -1) {
                
                newCart[existingItemIndex].Quantity += quantity;
            } else {
                newCart.push({
                    ID_CartItem: Date.now(), 
                    ID_Product: product.ID_Product,
                    Name_Product: product.Name_Product,
                    Price: product.Price,
                    Image: product.mainImage || product.Image, 
                    Quantity: quantity
                });
            }

            setCartItems(newCart);
            localStorage.setItem('cartItems', JSON.stringify(newCart));

            
            const total = newCart.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
            setCartTotal(total);

        }
    };

    const clearCart = async () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            
            try {
                await deleteCart();
                
                
                setCartItems([]);
                setCartTotal(0);
            } catch (error) {
                console.error("Lỗi xóa giỏ hàng trên server:", error);
                alert("Không thể xóa giỏ hàng lúc này!");
            }
        } else {
           
            setCartItems([]);
            setCartTotal(0);
            localStorage.removeItem('cartItems');
        }
    };

    const removeFromCart = async (itemId) => {
        const token = localStorage.getItem('token');
        if (token) {
            
            try {
                await deleteCartItem(itemId); 
                await fetchCart(); 
            }
            catch (error) {
                console.error("Lỗi xóa sản phẩm khỏi giỏ hàng trên server:", error);
                alert("Không thể xóa sản phẩm lúc này!");
            }
        } else {
            const newCart = cartItems.filter(item => item.ID_CartItem !== itemId);
            setCartItems(newCart);
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            const total = newCart.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
            setCartTotal(total);
        }
    };

    const cartCount = cartItems.reduce((total, item) => {
        return total + (parseInt(item.Quantity) || 0);
    }, 0);

    const value = {
        cartItems,
        cartTotal,
        addToCart,
        fetchCart, 
        cartCount,
        clearCart,
        removeFromCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};