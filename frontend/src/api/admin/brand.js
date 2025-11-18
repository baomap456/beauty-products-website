import axios from "../axios";

const getBrands = async () => {
    try {
        const response = await axios.get('/admin/brands');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createBrand = async (brandData) => {
    try {
        const response = await axios.post('/admin/brands', brandData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateBrand = async (brandId, brandData) => {
    try {
        const response = await axios.put(`/admin/brands/${brandId}`, brandData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteBrand = async (brandId) => {
    try {
        const response = await axios.delete(`/admin/brands/${brandId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export { getBrands, createBrand, updateBrand, deleteBrand };