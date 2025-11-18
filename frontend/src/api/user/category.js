import axios from "../axios";

const getCategories = async () => {
    try {
        const response = await axios.get('/user/categories');
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

const getCategoryById = async (categoryId) => {
    try {
        const response = await axios.get(`/user/categories/${categoryId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

export { getCategories, getCategoryById };