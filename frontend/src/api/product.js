import axios from './axios';

const getProducts = async () => {
    try {
        const response = await axios.get('/admin/products');
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getProductById = async (productId) => {
    try {
        const response = await axios.get(`/admin/products/${productId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

const createProduct = async (productData) => {
    try {
        const response = await axios.post('/admin/products', productData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const updateProduct = async (productId, productData) => {
    try {
        const response = await axios.put(`/admin/products/${productId}`, productData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`/admin/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const uploadImages = async (productId, imageFormData) => {
    try {
        const response = await axios.post(`/admin/products/${productId}/images`, imageFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
};