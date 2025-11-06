jest.resetModules();

const OLD_ENV = process.env;
beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    jest.doMock('../../models', () => ({
        Category: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn()
        }
    }));
});

afterAll(() => {
    process.env = OLD_ENV;
    jest.resetModules();
});

describe('category.service', () => {
    let db;
    let service;

    beforeEach(() => {
        db = require('../../models');
        service = require('../category.service');
    });

    afterEach(() => jest.clearAllMocks());

    test('getAllCategories -> calls Category.findAll and returns result', async () => {
        const mock = [{ id: 1 }];
        db.Category.findAll.mockResolvedValue(mock);
        const res = await service.getAllCategories();
        expect(db.Category.findAll).toHaveBeenCalledWith({ offset: 0, limit: 20 });
        expect(res).toBe(mock);
    });

    test('getCategoryById -> returns category when found', async () => {
        const c = { id: 7 };
        db.Category.findByPk.mockResolvedValue(c);
        const res = await service.getCategoryById(7);
        expect(db.Category.findByPk).toHaveBeenCalledWith(7);
        expect(res).toBe(c);
    });

    test('createCategory -> calls Category.create and returns created', async () => {
        const payload = { name: 'Cat' };
        const created = { id: 11, ...payload };
        db.Category.create.mockResolvedValue(created);
        const res = await service.createCategory(payload);
        expect(db.Category.create).toHaveBeenCalledWith(payload);
        expect(res).toBe(created);
    });

    test('updateCategory -> throws if not found', async () => {
        db.Category.findByPk.mockResolvedValue(null);
        await expect(service.updateCategory(1, { name: 'X' })).rejects.toThrow('Category not found');
    });

    test('updateCategory -> updates when found', async () => {
        const instance = { update: jest.fn().mockResolvedValue({ id: 2, name: 'Z' }) };
        db.Category.findByPk.mockResolvedValue(instance);
        const res = await service.updateCategory(2, { name: 'Z' });
        expect(instance.update).toHaveBeenCalledWith({ name: 'Z' });
        expect(res).toEqual({ id: 2, name: 'Z' });
    });

    test('deleteCategory -> throws if not found', async () => {
        db.Category.findByPk.mockResolvedValue(null);
        await expect(service.deleteCategory(9)).rejects.toThrow('Category not found');
    });

    test('deleteCategory -> destroys and returns category when found', async () => {
        const instance = { destroy: jest.fn().mockResolvedValue(true) };
        db.Category.findByPk.mockResolvedValue(instance);
        const res = await service.deleteCategory(8);
        expect(instance.destroy).toHaveBeenCalled();
        expect(res).toBe(instance);
    });
});