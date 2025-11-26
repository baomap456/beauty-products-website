const db = require('../models');
const Brand = db.Brand;

async function getAllBrands(page, limit) {
    try {
        const currentPage = parseInt(page) || 1;
        const currentLimit = parseInt(limit) || 20;
        const offset = (currentPage - 1) * currentLimit;
        const { count, rows } = await Brand.findAndCountAll({
            offset: offset,
            limit: currentLimit,
            order: [['ID_Brand', 'ASC']]
        });
        return {
            totalCount: count,
            items: rows,
            page: currentPage,
            limit: currentLimit
        };
    } catch (error) {
        console.error('Error in getAllBrands service:', error);
        throw error;
    }
}

async function getBrandById(id) {
    try {
        return await Brand.findByPk(id);
    } catch (error) {
        console.error('Error in getBrandById service:', error);
        throw error;
    }
}

async function createBrand(brandData) {
    try {
        return await Brand.create(brandData);
    } catch (error) {
        console.error('Error in createBrand service:', error);
        throw error;
    }
}

async function updateBrand(brandId, brandData) {
    try {
        const brand = await Brand.findByPk(brandId);
        if (!brand) {
            throw new Error('Brand not found');
        }
        return await brand.update(brandData);
    } catch (error) {
        console.error('Error in updateBrand service:', error);
        throw error;
    }
}

async function deleteBrand(brandId) {
    try {
        const brand = await Brand.findByPk(brandId);
        if (!brand) {
            throw new Error('Brand not found');
        }
        await brand.destroy();
    } catch (error) {
        console.error('Error in deleteBrand service:', error);
        throw error;
    }
}
module.exports = {
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
};