import axios from "../axios";

const getProducts = async (params) => {
    try {
        const response = await axios.get('/user/products', {
            params: params
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

const getProductById = async (productId) => {
    try {
        const response = await axios.get(`/user/products/${productId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};



export { getProducts, getProductById};