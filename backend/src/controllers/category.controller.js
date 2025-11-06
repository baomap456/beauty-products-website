const categoryService = require('../services/category.service');

const handleError = (res, error, message = 'Internal server error') => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        handleError(res, error, 'Error fetching categories');
    }
};

const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryService.getCategoryById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        handleError(res, error, 'Error fetching category');
    }
};

const createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const newCategory = await categoryService.createCategory(categoryData);
        res.status(201).json(newCategory);
    } catch (error) {
        handleError(res, error, 'Error creating category');
    }
};

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryData = req.body;
        const updatedCategory = await categoryService.updateCategory(categoryId, categoryData);
        res.json(updatedCategory);
    } catch (error) {
        handleError(res, error, 'Error updating category');
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await categoryService.deleteCategory(categoryId);
        res.status(204).send();
    } catch (error) {
        handleError(res, error, 'Error deleting category');
    }
};
module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};