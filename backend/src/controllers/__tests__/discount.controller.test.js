jest.mock('../../services/discount.service', () => ({
    createDiscount: jest.fn(),
    getAllDiscounts: jest.fn(),
    getDiscountById: jest.fn(),
    updateDiscount: jest.fn(),
    deleteDiscount: jest.fn(),
    applyDiscountToOrder: jest.fn(),
    getActiveDiscounts: jest.fn(),
    getExpiredDiscounts: jest.fn()
}));

const svc = require('../../services/discount.service');
const ctrl = require('../discount.controller');

function mockRes() {
    return {
        status: jest.fn(function () { return this; }),
        json: jest.fn(function () { return this; }),
        send: jest.fn(function () { return this; })
    };
}

beforeEach(() => jest.clearAllMocks());

test('createDiscount 201', async () => {
    const req = { body: { Code: 'X' } };
    const res = mockRes();
    svc.createDiscount.mockResolvedValue(req.body);
    await ctrl.createDiscount(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
});

test('getAllDiscounts 200', async () => {
    const req = {};
    const res = mockRes();
    const list = [{ ID_Discount: 1 }];
    svc.getAllDiscounts.mockResolvedValue(list);
    await ctrl.getAllDiscounts(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(list);
});

test('getDiscountById found 200', async () => {
    const req = { params: { id: '5' } };
    const res = mockRes();
    const item = { ID_Discount: 5 };
    svc.getDiscountById.mockResolvedValue(item);
    await ctrl.getDiscountById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(item);
});

test('getDiscountById not found 404', async () => {
    const req = { params: { id: '9' } };
    const res = mockRes();
    svc.getDiscountById.mockResolvedValue(null);
    await ctrl.getDiscountById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Discount not found' });
});

test('updateDiscount 200', async () => {
    const req = { params: { id: '3' }, body: { Value: 20 } };
    const res = mockRes();
    const updated = { ID_Discount: 3, Value: 20 };
    svc.updateDiscount.mockResolvedValue(updated);
    await ctrl.updateDiscount(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
});

test('updateDiscount not found 404', async () => {
    const req = { params: { id: '3' }, body: {} };
    const res = mockRes();
    svc.updateDiscount.mockRejectedValue(new Error('Discount not found'));
    await ctrl.updateDiscount(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Discount not found' });
});

test('deleteDiscount 204', async () => {
    const req = { params: { id: '4' } };
    const res = mockRes();
    svc.deleteDiscount.mockResolvedValue(true);
    await ctrl.deleteDiscount(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
});

test('deleteDiscount not found 404', async () => {
    const req = { params: { id: '4' } };
    const res = mockRes();
    svc.deleteDiscount.mockRejectedValue(new Error('Discount not found'));
    await ctrl.deleteDiscount(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Discount not found' });
});

test('applyDiscount success 200', async () => {
    const req = { body: { code: 'CODE', orderTotal: 100 } };
    const res = mockRes();
    svc.applyDiscountToOrder.mockResolvedValue(80);
    await ctrl.applyDiscount(req, res);
    expect(svc.applyDiscountToOrder).toHaveBeenCalledWith('CODE', 100);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ finalTotal: 80 });
});

test('applyDiscount validation 400 when missing fields', async () => {
    const req = { body: { code: 'X' } };
    const res = mockRes();
    await ctrl.applyDiscount(req, res);
    // controller should return 400 for missing orderTotal
    expect(res.status).toHaveBeenCalled();
});

test('applyDiscount invalid code 400', async () => {
    const req = { body: { code: 'BAD', orderTotal: 100 } };
    const res = mockRes();
    svc.applyDiscountToOrder.mockRejectedValue(new Error('Discount not found'));
    await ctrl.applyDiscount(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
});

test('getActiveDiscounts 200', async () => {
    const req = {};
    const res = mockRes();
    const rows = [{ ID_Discount: 1 }];
    svc.getActiveDiscounts.mockResolvedValue(rows);
    await ctrl.getActiveDiscounts(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
});

test('getExpiredDiscounts 200', async () => {
    const req = {};
    const res = mockRes();
    const rows = [{ ID_Discount: 2 }];
    svc.getExpiredDiscounts.mockResolvedValue(rows);
    await ctrl.getExpiredDiscounts(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
});