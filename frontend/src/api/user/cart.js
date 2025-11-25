import axios from '../axios'

const createCart = async (cartData) => {
    try {
        const response = await axios.post('/user/cart', cartData);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

const addItem = async (itemData) => {
    try {
        const response = await axios.post('/user/cart/items', itemData);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

const getCart = async () => {
    try {
        const response = await axios.get('/user/cart');
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await axios.put(`/user/cart/items/${itemId}`, { quantity: quantity });
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

const deleteCartItem = async (itemId) => {
    try {
        const response = await axios.delete(`/user/cart/items/${itemId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

const deleteCart = async () => {
    try {
        const response = await axios.delete('/user/cart');
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

const mergeCarts = async (localCartItems) => {
    try {
        const response = await axios.post('/user/cart/merge', { items: localCartItems });
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

export { createCart, getCart, addItem, updateCartItem, deleteCartItem, deleteCart, mergeCarts };