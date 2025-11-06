const db = require('../models');
const Brand = db.Brand;

async function getAllBrands() {
    try {
        const offset = 0;
        const limit = 20;
        return await Brand.findAll({ offset, limit });
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