const db = require('../models');
const Category = db.Category;

async function getAllCategories(page, limit) {
    try {
        const currentPage = parseInt(page) || 1;
        const currentLimit = parseInt(limit) || 20;
        const offset = (currentPage - 1) * currentLimit;
        const { count, rows } = await Category.findAndCountAll({
            offset: offset,
            limit: currentLimit,
            order: [['ID_Category', 'ASC']]
        });
        return {
            totalCount: count,
            items: rows,
            page: currentPage,
            limit: currentLimit
        };
    } catch (error) {
        console.error('Error in getAllCategories service:', error);
        throw error;
    }
}

async function getCategoryById(id) {
    try {
        return await Category.findByPk(id);
    } catch (error) {
        console.error('Error in getCategoryById service:', error);
        throw error;
    }
}

async function createCategory(categoryData) {
    try {
        return await Category.create(categoryData);
    } catch (error) {
        console.error('Error in createCategory service:', error);
        throw error;
    }
}

async function updateCategory(categoryId, categoryData) {
    try {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        return await category.update(categoryData);
    } catch (error) {
        console.error('Error in updateCategory service:', error);
        throw error;
    }
}

async function deleteCategory(categoryId) {
    try {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        await category.destroy();
        return category;
    } catch (error) {
        console.error('Error in deleteCategory service:', error);
        throw error;
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
