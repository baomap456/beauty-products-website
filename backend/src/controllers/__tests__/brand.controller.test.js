jest.resetModules();

// mock the service before requiring the controller
jest.doMock('../../services/brand.service', () => ({
    getAllBrands: jest.fn(),
    getBrandById: jest.fn(),
    createBrand: jest.fn(),
    updateBrand: jest.fn(),
    deleteBrand: jest.fn()
}));

const brandService = require('../../services/brand.service');
const controller = require('../brand.controller');

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
}

describe('brand.controller', () => {
    afterEach(() => jest.clearAllMocks());

    test('getAllBrands -> returns list', async () => {
        const list = [{ id: 1 }];
        brandService.getAllBrands.mockResolvedValue(list);
        const req = {};
        const res = mockRes();
        await controller.getAllBrands(req, res);
        expect(brandService.getAllBrands).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(list);
    });

    test('getBrandById -> 404 when not found', async () => {
        brandService.getBrandById.mockResolvedValue(null);
        const req = { params: { id: '5' } };
        const res = mockRes();
        await controller.getBrandById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Brand not found' });
    });

    test('createBrand -> 201 with created', async () => {
        const created = { id: 2, name: 'B' };
        brandService.createBrand.mockResolvedValue(created);
        const req = { body: { name: 'B' } };
        const res = mockRes();
        await controller.createBrand(req, res);
        expect(brandService.createBrand).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(created);
    });

    test('updateBrand -> calls service and returns updated', async () => {
        const updated = { id: 3, name: 'C' };
        brandService.updateBrand.mockResolvedValue(updated);
        const req = { params: { id: '3' }, body: { name: 'C' } };
        const res = mockRes();
        await controller.updateBrand(req, res);
        expect(brandService.updateBrand).toHaveBeenCalledWith('3', req.body);
        expect(res.json).toHaveBeenCalledWith(updated);
    });

    test('deleteBrand -> 204 on success', async () => {
        brandService.deleteBrand.mockResolvedValue();
        const req = { params: { id: '4' } };
        const res = mockRes();
        await controller.deleteBrand(req, res);
        expect(brandService.deleteBrand).toHaveBeenCalledWith('4');
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });
});