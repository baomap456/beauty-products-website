const db = require('../models');
const { Op } = require('sequelize');
const Product = db.Product;
const Category = db.Category;
const Brand = db.Brand;

async function getAllProducts({ page = 1, limit = 20, name, category_id, brand_id, minPrice, maxPrice }) {
    try {
        // 1. Xử lý phân trang
        const offset = (page - 1) * limit;
        const limitNum = parseInt(limit);

        // 2. Xây dựng câu lệnh WHERE (Lọc & Tìm kiếm gộp làm một)
        const whereClause = {};

        // Tìm kiếm theo tên (Tương đối - LIKE)
        if (name) {
            whereClause.Name_Product = { [Op.like]: `%${name}%` }; // Chú ý tên trường trong DB là Name_Product hay Product_Name
        }

        // Lọc theo Category
        if (category_id) {
            whereClause.Category_ID = category_id;
        }

        // Lọc theo Brand
        if (brand_id) {
            whereClause.Brand_ID = brand_id;
        }

        // Lọc theo Giá
        if (minPrice && maxPrice) {
            whereClause.Price = { [Op.between]: [minPrice, maxPrice] };
        } else if (minPrice) {
            whereClause.Price = { [Op.gte]: minPrice };
        }

        // 3. Gọi Database: Dùng findAndCountAll để lấy cả dữ liệu và tổng số
        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            include: [
                { model: Category, as: 'Category' },
                { model: Brand, as: 'Brand' }
            ],
            offset: offset,
            limit: limitNum,
            order: [['createdAt', 'DESC']] // Sắp xếp mới nhất lên đầu (Tùy chọn)
        });

        // 4. Trả về cấu trúc chuẩn cho Frontend
        return {
            totalCount: count, // Tổng số sản phẩm (để tính phân trang)
            items: rows        // Danh sách sản phẩm trang hiện tại
        };

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



module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByBrand,

};
