const mockPayment = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAndCountAll: jest.fn()
};

jest.mock('../../models', () => ({ Payment: mockPayment }));

const paymentService = require('../payment.service');

beforeEach(() => {
    jest.clearAllMocks();
});

test('createPayment - success', async () => {
    const fake = { ID_Payment: 1, Order_ID: 10, Method: 'momo', Status: 'Unpaid' };
    mockPayment.create.mockResolvedValue(fake);

    const res = await paymentService.createPayment(10, 'momo', 'note');
    expect(mockPayment.create).toHaveBeenCalledWith(expect.objectContaining({
        Order_ID: 10,
        Method: 'momo',
        Status: 'Unpaid',
        Note: 'note',
        PaymentDate: null
    }));
    expect(res).toBe(fake);
});

test('createPayment - error bubbles up', async () => {
    mockPayment.create.mockRejectedValue(new Error('db fail'));
    await expect(paymentService.createPayment(1, 'card')).rejects.toThrow(/Error creating payment/i);
});

test('getPaymentByOrderId - success', async () => {
    const fake = { ID_Payment: 2, Order_ID: 5 };
    mockPayment.findOne.mockResolvedValue(fake);

    const res = await paymentService.getPaymentByOrderId(5);
    expect(mockPayment.findOne).toHaveBeenCalledWith({ where: { Order_ID: 5 } });
    expect(res).toBe(fake);
});

test('getPaymentByOrderId - error bubbles up', async () => {
    mockPayment.findOne.mockRejectedValue(new Error('fail'));
    await expect(paymentService.getPaymentByOrderId(1)).rejects.toThrow(/Error retrieving payment/i);
});

test('updatePaymentStatus - success sets PaymentDate when Paid', async () => {
    const paymentObj = { ID_Payment: 3, Order_ID: 7, Status: 'Unpaid', save: jest.fn() };
    mockPayment.findOne.mockResolvedValue(paymentObj);

    const updated = await paymentService.updatePaymentStatus(7, 'Paid');
    expect(mockPayment.findOne).toHaveBeenCalledWith({ where: { Order_ID: 7 } });
    expect(paymentObj.Status).toBe('Paid');
    expect(paymentObj.PaymentDate).toBeInstanceOf(Date);
    expect(paymentObj.save).toHaveBeenCalled();
    expect(updated).toBe(paymentObj);
});

test('updatePaymentStatus - not found throws', async () => {
    mockPayment.findOne.mockResolvedValue(null);
    await expect(paymentService.updatePaymentStatus(99, 'Paid')).rejects.toThrow(/Payment not found/i);
});

test('getAllPayments - success returns count/rows', async () => {
    const rows = [{ ID_Payment: 1 }];
    mockPayment.findAndCountAll.mockResolvedValue({ count: 10, rows });
    const res = await paymentService.getAllPayments({ page: 2, limit: 5, status: 'Pending', method: 'momo' });
    expect(mockPayment.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ Status: 'Pending', Method: 'momo' }),
        offset: 5,
        limit: 5,
        order: [['PaymentDate', 'DESC']]
    }));
    expect(res).toEqual({ count: 10, rows });
});

test('getAllPayments - error bubbles up', async () => {
    mockPayment.findAndCountAll.mockRejectedValue(new Error('db fail'));
    await expect(paymentService.getAllPayments({})).rejects.toThrow(/Error retrieving payments/i);
});