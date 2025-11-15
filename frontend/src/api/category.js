import axios from "./axios";

const getCategories = async () => {
    try {
        const response = await axios.get('/admin/categories');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createCategory = async (categoryData) => {
    try {
        const response = await axios.post('/admin/categories', categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await axios.put(`/admin/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`/admin/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export { getCategories, createCategory, updateCategory, deleteCategory };