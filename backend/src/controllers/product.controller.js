const productService = require('../services/product.service');

const handleError = (res, error, message = 'Internal server error') => {
    console.error(message, error);
    return res.status(error?.status || 500).json({ error: message });
};

function validateRequired(body) {
    // Kiểm tra các key viết hoa
    if (!body || !body.Name_Product || body.Price == null || body.Stock == null || body.Category_ID == null || body.Brand_ID == null) return false;
    return true;
}

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        handleError(res, error, 'Error fetching products');
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        handleError(res, error, 'Error fetching product by ID');
    }
};

const createProduct = async (req, res) => {
    try {
        if (!validateRequired(req.body))
            return res.status(400).json({ error: 'Missing required fields' });

        // safety: ensure service function exists
        if (typeof productService.createProduct !== 'function') {
            console.error('productService.createProduct is not a function', productService);
            return res.status(500).json({ error: 'Product service not available' });
        }

        const created = await productService.createProduct(req.body);
        return res.status(201).json(created);
    } catch (error) {
        return handleError(res, error, 'Error creating product');
    }
};

const updateProduct = async (req, res) => {
    try {
        // fix: declare productData before validating it
        const productId = req.params.id;
        const productData = req.body;
        if (!productData.name || !productData.price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const updatedProduct = await productService.updateProduct(productId, productData);
        res.json(updatedProduct);
    } catch (error) {
        handleError(res, error, 'Error updating product');
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await productService.deleteProduct(productId);
        res.status(204).send();
    } catch (error) {
        handleError(res, error, 'Error deleting product');
    }
};

const getPaginatedProducts = async (req, res) => {
    try {
        const { page, limit, ...filters } = req.query;
        const paginatedProducts = await productService.getPaginatedProducts(page, limit, filters);
        res.json(paginatedProducts);
    } catch (error) {
        handleError(res, error, 'Error fetching paginated products');
    }
};

const searchProduct = async (req, res) => {
    try {
        const { query } = req.query;
        const products = await productService.searchProduct(query);
        res.json(products);
    } catch (error) {
        handleError(res, error, 'Error searching products');
    }
};

const filterProducts = async (req, res) => {
    try {
        const filters = req.body;
        const filteredProducts = await productService.getProductsWithFilters(filters);
        res.json(filteredProducts);
    } catch (error) {
        handleError(res, error, 'Error filtering products');
    }
};

const getPaginatedProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const filters = req.query.filters || {};
        const paginatedProducts = await productService.getPaginatedProducts(page, limit, filters);
        res.json(paginatedProducts);
    } catch (error) {
        handleError(res, error, 'Error fetching paginated products');
    }
};

const sortProducts = async (req, res) => {
    try {
        const { sortBy, order } = req.query;
        const sortedProducts = await productService.sortProducts(sortBy, order);
        res.json(sortedProducts);
    } catch (error) {
        handleError(res, error, 'Error sorting products');
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getPaginatedProducts,
    searchProduct,
    filterProducts,
    getPaginatedProduct,
    sortProducts
};
