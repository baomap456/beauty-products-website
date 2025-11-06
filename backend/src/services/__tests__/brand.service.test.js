jest.resetModules();

const OLD_ENV = process.env;
beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    // mock models before requiring the service
    jest.doMock('../../models', () => ({
        Brand: {
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

describe('brand.service', () => {
    let db;
    let service;

    beforeEach(() => {
        db = require('../../models');
        service = require('../brand.service');
    });

    afterEach(() => jest.clearAllMocks());

    test('getAllBrands -> calls Brand.findAll and returns result', async () => {
        const mock = [{ id: 1 }, { id: 2 }];
        db.Brand.findAll.mockResolvedValue(mock);
        const res = await service.getAllBrands();
        expect(db.Brand.findAll).toHaveBeenCalledWith({ offset: 0, limit: 20 });
        expect(res).toBe(mock);
    });

    test('getBrandById -> returns brand when found', async () => {
        const b = { id: 5 };
        db.Brand.findByPk.mockResolvedValue(b);
        const res = await service.getBrandById(5);
        expect(db.Brand.findByPk).toHaveBeenCalledWith(5);
        expect(res).toBe(b);
    });

    test('createBrand -> calls Brand.create and returns created', async () => {
        const payload = { name: 'X' };
        const created = { id: 10, ...payload };
        db.Brand.create.mockResolvedValue(created);
        const res = await service.createBrand(payload);
        expect(db.Brand.create).toHaveBeenCalledWith(payload);
        expect(res).toBe(created);
    });

    test('updateBrand -> throws if brand not found', async () => {
        db.Brand.findByPk.mockResolvedValue(null);
        await expect(service.updateBrand(1, { name: 'Y' })).rejects.toThrow('Brand not found');
    });

    test('updateBrand -> calls instance.update when found', async () => {
        const instance = { update: jest.fn().mockResolvedValue({ id: 1, name: 'Y' }) };
        db.Brand.findByPk.mockResolvedValue(instance);
        const res = await service.updateBrand(1, { name: 'Y' });
        expect(instance.update).toHaveBeenCalledWith({ name: 'Y' });
        expect(res).toEqual({ id: 1, name: 'Y' });
    });

    test('deleteBrand -> throws if not found', async () => {
        db.Brand.findByPk.mockResolvedValue(null);
        await expect(service.deleteBrand(2)).rejects.toThrow('Brand not found');
    });

    test('deleteBrand -> destroys instance when found', async () => {
        const instance = { destroy: jest.fn().mockResolvedValue(true) };
        db.Brand.findByPk.mockResolvedValue(instance);
        await expect(service.deleteBrand(3)).resolves.toBeUndefined();
        expect(instance.destroy).toHaveBeenCalled();
    });
});