const brandService = require('../services/brand.service');

const handleError = (res, error, message = 'Internal server error') => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

const getAllBrands = async (req, res) => {
    try {
        const brands = await brandService.getAllBrands();
        res.json(brands);
    } catch (error) {
        handleError(res, error, 'Error fetching brands');
    }
};


const getBrandById = async (req, res) => {
    try {
        const brandId = req.params.id;
        const brand = await brandService.getBrandById(brandId);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        res.json(brand);
    } catch (error) {
        handleError(res, error, 'Error fetching brand');
    }
};

const createBrand = async (req, res) => {
    try {
        const brandData = req.body;
        const newBrand = await brandService.createBrand(brandData);
        res.status(201).json(newBrand);
    } catch (error) {
        handleError(res, error, 'Error creating brand');
    }
};
const updateBrand = async (req, res) => {
    try {
        const brandId = req.params.id;
        const brandData = req.body;
        const updatedBrand = await brandService.updateBrand(brandId, brandData);
        res.json(updatedBrand);
    } catch (error) {
        handleError(res, error, 'Error updating brand');
    }
};
const deleteBrand = async (req, res) => {
    try {
        const brandId = req.params.id;
        await brandService.deleteBrand(brandId);
        res.status(204).send();
    } catch (error) {
        handleError(res, error, 'Error deleting brand');
    }
};

module.exports = {
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
};