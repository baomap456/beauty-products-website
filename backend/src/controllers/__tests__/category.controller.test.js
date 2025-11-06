jest.resetModules();

// mock the service before requiring the controller
jest.doMock('../../services/category.service', () => ({
    getAllCategories: jest.fn(),
    getCategoryById: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn()
}));

const categoryService = require('../../services/category.service');
const controller = require('../category.controller');

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
}

describe('category.controller', () => {
    afterEach(() => jest.clearAllMocks());

    test('getAllCategories -> returns list', async () => {
        const list = [{ id: 1 }];
        categoryService.getAllCategories.mockResolvedValue(list);
        const req = {};
        const res = mockRes();
        await controller.getAllCategories(req, res);
        expect(categoryService.getAllCategories).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(list);
    });

    test('getCategoryById -> 404 when not found', async () => {
        categoryService.getCategoryById.mockResolvedValue(null);
        const req = { params: { id: '5' } };
        const res = mockRes();
        await controller.getCategoryById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });

    test('createCategory -> 201 with created', async () => {
        const created = { id: 2, name: 'Cat' };
        categoryService.createCategory.mockResolvedValue(created);
        const req = { body: { name: 'Cat' } };
        const res = mockRes();
        await controller.createCategory(req, res);
        expect(categoryService.createCategory).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(created);
    });

    test('updateCategory -> calls service and returns updated', async () => {
        const updated = { id: 3, name: 'New' };
        categoryService.updateCategory.mockResolvedValue(updated);
        const req = { params: { id: '3' }, body: { name: 'New' } };
        const res = mockRes();
        await controller.updateCategory(req, res);
        expect(categoryService.updateCategory).toHaveBeenCalledWith('3', req.body);
        expect(res.json).toHaveBeenCalledWith(updated);
    });

    test('deleteCategory -> 204 on success', async () => {
        categoryService.deleteCategory.mockResolvedValue();
        const req = { params: { id: '4' } };
        const res = mockRes();
        await controller.deleteCategory(req, res);
        expect(categoryService.deleteCategory).toHaveBeenCalledWith('4');
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });
});
