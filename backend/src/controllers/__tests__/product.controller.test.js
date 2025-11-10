// Unit tests for product.controller
jest.mock('../../services/product.service', () => ({
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getPaginatedProducts: jest.fn(),
    searchProduct: jest.fn(),
    getProductsWithFilters: jest.fn(),
    sortProducts: jest.fn(),
}));

// silence noisy error logs from controllers during tests
beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => { }));
afterAll(() => console.error.mockRestore && console.error.mockRestore());

const productService = require('../../services/product.service');
const controller = require('../product.controller');

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
}

describe('product.controller unit tests', () => {
    afterEach(() => jest.clearAllMocks());

    test('getAllProducts - success', async () => {
        const products = [{ id: 1 }];
        productService.getAllProducts.mockResolvedValue(products);

        const req = {};
        const res = mockRes();

        await controller.getAllProducts(req, res);
        expect(productService.getAllProducts).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(products);
    });

    test('getAllProducts - service error -> 500', async () => {
        productService.getAllProducts.mockRejectedValue(new Error('fail'));
        const req = {};
        const res = mockRes();

        await controller.getAllProducts(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching products' });
    });

    test('getProductById - found', async () => {
        const product = { ID_Product: 1 };
        productService.getProductById.mockResolvedValue(product);
        const req = { params: { id: '1' } };
        const res = mockRes();

        await controller.getProductById(req, res);
        expect(productService.getProductById).toHaveBeenCalledWith('1');
        expect(res.json).toHaveBeenCalledWith(product);
    });

    test('getProductById - not found -> 404', async () => {
        productService.getProductById.mockResolvedValue(null);
        const req = { params: { id: '2' } };
        const res = mockRes();

        await controller.getProductById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    test('createProduct - missing fields -> 400', async () => {
        const req = { body: { name: 'X' } }; // missing price
        const res = mockRes();

        await controller.createProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    test('createProduct - success -> 201', async () => {
        const created = { ID_Product: 5, Product_Name: 'X' };
        productService.createProduct.mockResolvedValue(created);
        const req = { body: { name: 'X', price: 10 } };
        const res = mockRes();

        await controller.createProduct(req, res);
        expect(productService.createProduct).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(created);
    });

    test('updateProduct - missing fields -> 400', async () => {
        const req = { params: { id: '1' }, body: { name: 'OnlyName' } }; // missing price
        const res = mockRes();

        await controller.updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    test('updateProduct - success', async () => {
        const updated = { ID_Product: 1, Product_Name: 'Updated' };
        productService.updateProduct.mockResolvedValue(updated);
        const req = { params: { id: '1' }, body: { name: 'Updated', price: 20 } };
        const res = mockRes();

        await controller.updateProduct(req, res);
        expect(productService.updateProduct).toHaveBeenCalledWith('1', req.body);
        expect(res.json).toHaveBeenCalledWith(updated);
    });

    test('deleteProduct - success -> 204', async () => {
        productService.deleteProduct.mockResolvedValue();
        const req = { params: { id: '1' } };
        const res = mockRes();

        await controller.deleteProduct(req, res);
        expect(productService.deleteProduct).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    test('getPaginatedProduct passes parsed page/limit to service', async () => {
        const page = '2';
        const limit = '5';
        const result = { items: [] };
        productService.getPaginatedProducts.mockResolvedValue(result);

        const req = { query: { page, limit } };
        const res = mockRes();

        await controller.getPaginatedProduct(req, res);
        expect(productService.getPaginatedProducts).toHaveBeenCalledWith(2, 5, {});
        expect(res.json).toHaveBeenCalledWith(result);
    });

    test('searchProduct forwards query', async () => {
        const found = [{ ID_Product: 1 }];
        productService.searchProduct.mockResolvedValue(found);
        const req = { query: { query: 'abc' } };
        const res = mockRes();

        await controller.searchProduct(req, res);
        expect(productService.searchProduct).toHaveBeenCalledWith('abc');
        expect(res.json).toHaveBeenCalledWith(found);
    });

    test('filterProducts forwards body to service', async () => {
        const filtered = [{ ID_Product: 2 }];
        productService.getProductsWithFilters.mockResolvedValue(filtered);
        const req = { body: { category: 1 } };
        const res = mockRes();

        await controller.filterProducts(req, res);
        expect(productService.getProductsWithFilters).toHaveBeenCalledWith(req.body);
        expect(res.json).toHaveBeenCalledWith(filtered);
    });

    test('sortProducts forwards params to service', async () => {
        const sorted = [{ ID_Product: 3 }];
        productService.sortProducts.mockResolvedValue(sorted);
        const req = { query: { sortBy: 'price', order: 'asc' } };
        const res = mockRes();

        await controller.sortProducts(req, res);
        expect(productService.sortProducts).toHaveBeenCalledWith('price', 'asc');
        expect(res.json).toHaveBeenCalledWith(sorted);
    });
});