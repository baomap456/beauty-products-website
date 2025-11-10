jest.mock('../../services/payment.service', () => ({
    createPayment: jest.fn(),
    getPaymentByOrderId: jest.fn(),
    updatePaymentStatus: jest.fn(),
    getAllPayments: jest.fn()
}));

const paymentService = require('../../services/payment.service');
const controller = require('../payment.controller');

function mockRes() {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    res.send = jest.fn(() => res);
    return res;
}

beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => { }));
afterAll(() => console.error.mockRestore && console.error.mockRestore());
beforeEach(() => jest.clearAllMocks());

test('createPayment - success -> 201', async () => {
    const req = { body: { orderId: 1, method: 'momo', note: 'ok' } };
    const res = mockRes();
    const fakePayment = { ID_Payment: 1, Order_ID: 1 };
    paymentService.createPayment.mockResolvedValue(fakePayment);

    await controller.createPayment(req, res);

    expect(paymentService.createPayment).toHaveBeenCalledWith(1, 'momo', 'ok');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), payment: fakePayment }));
});

test('createPayment - missing fields -> 400', async () => {
    const req = { body: { orderId: null } };
    const res = mockRes();

    await controller.createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Thiếu thông tin bắt buộc' });
});

test('getPaymentByOrderId - success -> 200', async () => {
    const req = { params: { orderId: '5' } };
    const res = mockRes();
    const fake = { ID_Payment: 2, Order_ID: 5 };
    paymentService.getPaymentByOrderId.mockResolvedValue(fake);

    await controller.getPaymentByOrderId(req, res);

    expect(paymentService.getPaymentByOrderId).toHaveBeenCalledWith('5');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fake);
});

test('getPaymentByOrderId - not found -> 404', async () => {
    const req = { params: { orderId: '9' } };
    const res = mockRes();
    paymentService.getPaymentByOrderId.mockResolvedValue(null);

    await controller.getPaymentByOrderId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Không tìm thấy thanh toán' });
});

test('updatePaymentStatus - success -> 200', async () => {
    const req = { params: { orderId: '7' }, body: { status: 'Paid' } };
    const res = mockRes();
    const updated = { ID_Payment: 3, Status: 'Paid' };
    paymentService.updatePaymentStatus.mockResolvedValue(updated);

    await controller.updatePaymentStatus(req, res);

    expect(paymentService.updatePaymentStatus).toHaveBeenCalledWith('7', 'Paid');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), payment: updated }));
});

test('updatePaymentStatus - missing status -> 400', async () => {
    const req = { params: { orderId: '7' }, body: {} };
    const res = mockRes();

    await controller.updatePaymentStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Thiếu trạng thái thanh toán' });
});

test('getAllPayments - success -> 200', async () => {
    const req = { query: { page: '2', limit: '5', status: 'Pending', method: 'momo' } };
    const res = mockRes();
    const rows = [{ ID_Payment: 1 }];
    paymentService.getAllPayments.mockResolvedValue({ count: 11, rows });

    await controller.getAllPayments(req, res);

    expect(paymentService.getAllPayments).toHaveBeenCalledWith({ page: 2, limit: 5, status: 'Pending', method: 'momo' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        message: 'Lấy danh sách thanh toán thành công!',
        total: 11,
        payments: rows
    });
});
