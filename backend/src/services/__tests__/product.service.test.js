const { Op } = require('sequelize');

const OLD_ENV = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    // mock models before requiring service
    jest.doMock('../../models', () => {
        const mockProductInstance = {
            update: jest.fn().mockResolvedValue(true),
            destroy: jest.fn().mockResolvedValue(true)
        };
        return {
            Product: {
                findAll: jest.fn(),
                findByPk: jest.fn(),
                create: jest.fn()
            },
            Category: { findByPk: jest.fn() },
            Brand: { findByPk: jest.fn() },
            // export Op for convenience if needed
        };
    });
});

afterAll(() => {
    process.env = OLD_ENV;
    jest.resetModules();
});

describe('product.service unit tests', () => {
    let service;
    let db;

    beforeEach(() => {
        db = require('../../models');
        service = require('../product.service');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllProducts should call Product.findAll and return results', async () => {
        const mockProducts = [{ id: 1 }, { id: 2 }];
        db.Product.findAll.mockResolvedValue(mockProducts);

        const res = await service.getAllProducts(1, 10);
        expect(db.Product.findAll).toHaveBeenCalledWith(expect.objectContaining({
            include: expect.any(Array),
            offset: 0,
            limit: 10
        }));
        expect(res).toBe(mockProducts);
    });

    test('createProduct should throw when Category not found', async () => {
        db.Category.findByPk.mockResolvedValue(null);
        db.Brand.findByPk.mockResolvedValue({});

        await expect(service.createProduct({ Category_ID: 1, Brand_ID: 2 })).rejects.toThrow('Danh mục không tồn tại');
    });

    test('createProduct should throw when Brand not found', async () => {
        db.Category.findByPk.mockResolvedValue({});
        db.Brand.findByPk.mockResolvedValue(null);

        await expect(service.createProduct({ Category_ID: 1, Brand_ID: 2 })).rejects.toThrow('Thương hiệu không tồn tại');
    });

    test('createProduct should create product when category and brand exist', async () => {
        const payload = { Product_Name: 'X', Category_ID: 1, Brand_ID: 2 };
        db.Category.findByPk.mockResolvedValue({});
        db.Brand.findByPk.mockResolvedValue({});
        const created = { id: 5, ...payload };
        db.Product.create.mockResolvedValue(created);

        const res = await service.createProduct(payload);
        expect(db.Product.create).toHaveBeenCalledWith(payload);
        expect(res).toBe(created);
    });

    test('updateProduct should throw when product not found', async () => {
        db.Product.findByPk.mockResolvedValue(null);
        await expect(service.updateProduct(10, { Product_Name: 'New' })).rejects.toThrow('Product not found');
    });

    test('deleteProduct should throw when product not found', async () => {
        db.Product.findByPk.mockResolvedValue(null);
        await expect(service.deleteProduct(11)).rejects.toThrow('Product not found');
    });

    test('deleteProduct should destroy and return product when found', async () => {
        const productInstance = { destroy: jest.fn().mockResolvedValue(true) };
        db.Product.findByPk.mockResolvedValue(productInstance);

        const res = await service.deleteProduct(12);
        expect(productInstance.destroy).toHaveBeenCalled();
        expect(res).toBe(productInstance);
    });
});