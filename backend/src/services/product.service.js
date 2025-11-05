const db = require('../models');
const { Op } = require('sequelize');
const Product = db.Product;
const Category = db.Category;
const Brand = db.Brand;

async function getAllProducts(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    try {
        return await Product.findAll({
            include: [
                { model: Category, as: 'Category' },
                { model: Brand, as: 'Brand' }
            ],
            offset,
            limit
        });
    } catch (error) {
        console.error('Error in getAllProducts service:', error);
        throw error;
    }
}
async function getProductById(productId) {
    try {
        const product = await Product.findByPk(productId, {
            include: [
                { model: Category, as: 'Category' },
                { model: Brand, as: 'Brand' }
            ]
        });
        return product;
    }
    catch (error) {
        console.error('Error in getProductById service:', error);
        throw error;
    }

}

async function createProduct(productData) {
    try {
        const { Category_ID, Brand_ID } = productData;
        const [category, brand] = await Promise.all([
            Category.findByPk(Category_ID),
            Brand.findByPk(Brand_ID)
        ]);

        if (!category) throw new Error('Danh mục không tồn tại');
        if (!brand) throw new Error('Thương hiệu không tồn tại');
        const newProduct = await Product.create(productData);
        return newProduct;
    }
    catch (error) {
        console.error('Error in createProduct service:', error);
        throw error;
    }

}

async function updateProduct(productId, productData) {
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (productData.Category_ID) {
            const category = await Category.findByPk(productData.Category_ID);
            if (!category) throw new Error('Danh mục không tồn tại');
        }

        if (productData.Brand_ID) {
            const brand = await Brand.findByPk(productData.Brand_ID);
            if (!brand) throw new Error('Thương hiệu không tồn tại');
        }
        await product.update(productData);
        return product;
    }
    catch (error) {
        console.error('Error in updateProduct service:', error);
        throw error;
    }
}

async function deleteProduct(productId) {
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        await product.destroy();
        return product;
    }
    catch (error) {
        console.error('Error in deleteProduct service:', error);
        throw error;
    }

}

async function getProductsByCategory(categoryId) {
    try {
        return await Product.findAll({
            where: { Category_ID: categoryId },
            include: [
                { model: Category, as: 'Category' },
                { model: Brand, as: 'Brand' }
            ]
        });
    } catch (error) {
        console.error('Error in getProductsByCategory service:', error);
        throw error;
    }
}

async function getProductsByBrand(brandId) {
    try {
        return await Product.findAll({
            where: { Brand_ID: brandId },
            include: [
                { model: Category, as: 'Category' },
                { model: Brand, as: 'Brand' }
            ]
        });
    } catch (error) {
        console.error('Error in getProductsByBrand service:', error);
        throw error;
    }
}

async function getProductsWithFilters(filters) {
    try {
        const whereClause = {};

        if (filters.categoryId) {
            whereClause.Category_ID = filters.categoryId;
        }
        if (filters.brandId) {
            whereClause.Brand_ID = filters.brandId;
        }
        if (filters.minPrice) {
            whereClause.Price = { [Op.gte]: filters.minPrice };
        }
        if (filters.maxPrice) {
            whereClause.Price = whereClause.Price || {};
            whereClause.Price[Op.lte] = filters.maxPrice;
        }
        if (filters.Product_Name) {
            whereClause.Product_Name = { [Op.like]: `%${filters.Product_Name}%` };
        }

        return await Product.findAll({
            where: whereClause,
            include: [
                { model: Category, as: 'Category' },
                { model: Brand, as: 'Brand' }
            ]
        });
    } catch (error) {
        console.error('Error in getProductsWithFilters service:', error);
        throw error;
    }
}

async function searchProduct(Keyword) {
    try {
        return await Product.findAll({
            where: {
                Product_Name: { [Op.like]: `%${Keyword}%` }
            },
            include: [
                { model: Category, as: 'Category' },
                { model: Brand, as: 'Brand' }
            ]
        });
    } catch (error) {
        console.error('Error in searchProduct service:', error);
        throw error;
    }

}

async function getPaginatedProducts(page, limit, filters) {
    const offset = (page - 1) * limit;
    try {
        const whereClause = {};
        if (filters.categoryId) {
            whereClause.Category_ID = filters.categoryId;
        }
        if (filters.brandId) {
            whereClause.Brand_ID = filters.brandId;
        }
        if (filters.minPrice) {
            whereClause.Price = { [Op.gte]: filters.minPrice };
        }
        if (filters.maxPrice) {
            whereClause.Price = whereClause.Price || {};
            whereClause.Price[Op.lte] = filters.maxPrice;
        }
        if (filters.Product_Name) {
            whereClause.Product_Name = { [Op.like]: `%${filters.Product_Name}%` };
        }

        return {
            products: rows,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        };
    } catch (error) {
        console.error('Error in getPaginatedProducts service:', error);
        throw error;
    }
}

async function sortProducts(sortBy, order) {
    try {
        return await Product.findAll({
            order: [[sortBy, order]],
            include: [
                { model: Category, as: 'Category' },
                { model: Brand, as: 'Brand' }
            ]
        });
    } catch (error) {
        console.error('Error in sortProducts service:', error);
        throw error;
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByBrand,
    getProductsWithFilters,
    searchProduct,
    getPaginatedProducts,
    sortProducts,
};
