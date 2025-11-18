import axios from "../axios";

const getBrands = async () => {
    try {
        const response = await axios.get('/user/brands');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBrandById = async (brandId) => {
    try {
        const response = await axios.get(`/user/brands/${brandId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

export { getBrands, getBrandById };