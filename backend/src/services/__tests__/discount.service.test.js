const mockDiscount = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn()
};

jest.mock('../../models', () => ({
    Discount: mockDiscount,
    Sequelize: { Op: { and: Symbol('and'), lte: 'lte', gte: 'gte', lt: 'lt', gt: 'gt' } }
}));

const service = require('../discount.service');

beforeEach(() => jest.clearAllMocks());

test('createDiscount creates record', async () => {
    const data = { Code: 'A', Value: 10 };
    mockDiscount.create.mockResolvedValue(data);
    const res = await service.createDiscount(data);
    expect(mockDiscount.create).toHaveBeenCalledWith(data);
    expect(res).toBe(data);
});

test('getAllDiscounts returns array', async () => {
    const rows = [{ ID_Discount: 1 }];
    mockDiscount.findAll.mockResolvedValue(rows);
    const res = await service.getAllDiscounts();
    expect(res).toBe(rows);
});

test('getDiscountById returns found', async () => {
    const row = { ID_Discount: 2 };
    mockDiscount.findByPk.mockResolvedValue(row);
    const res = await service.getDiscountById(2);
    expect(res).toBe(row);
});

test('updateDiscount returns updated row', async () => {
    mockDiscount.update.mockResolvedValue([1]);
    const updated = { ID_Discount: 3 };
    mockDiscount.findByPk.mockResolvedValue(updated);
    const res = await service.updateDiscount(3, { Value: 20 });
    expect(mockDiscount.update).toHaveBeenCalledWith({ Value: 20 }, { where: { ID_Discount: 3 } });
    expect(res).toBe(updated);
});

test('updateDiscount throws when not found', async () => {
    mockDiscount.update.mockResolvedValue([0]);
    await expect(service.updateDiscount(9, {})).rejects.toThrow(/Discount not found/);
});

test('deleteDiscount returns true', async () => {
    mockDiscount.destroy.mockResolvedValue(1);
    const res = await service.deleteDiscount(5);
    expect(mockDiscount.destroy).toHaveBeenCalledWith({ where: { ID_Discount: 5 } });
    expect(res).toBe(true);
});

test('deleteDiscount throws when not found', async () => {
    mockDiscount.destroy.mockResolvedValue(0);
    await expect(service.deleteDiscount(5)).rejects.toThrow(/Discount not found/);
});

test('checkDiscountValidity success', async () => {
    const now = new Date();
    const valid = { Code: 'X', StartDate: new Date(now.getTime() - 1000), EndDate: new Date(now.getTime() + 1000), Value: 10 };
    mockDiscount.findOne.mockResolvedValue(valid);
    const res = await service.checkDiscountValidity('X');
    expect(mockDiscount.findOne).toHaveBeenCalledWith({ where: { Code: 'X' } });
    expect(res).toBe(valid);
});

test('checkDiscountValidity not found', async () => {
    mockDiscount.findOne.mockResolvedValue(null);
    await expect(service.checkDiscountValidity('NO')).rejects.toThrow(/Discount not found/);
});

test('checkDiscountValidity not yet valid', async () => {
    const future = { Code: 'F', StartDate: new Date(Date.now() + 100000), EndDate: new Date(Date.now() + 200000), Value: 5 };
    mockDiscount.findOne.mockResolvedValue(future);
    await expect(service.checkDiscountValidity('F')).rejects.toThrow(/not yet valid/);
});

test('checkDiscountValidity expired', async () => {
    const past = { Code: 'P', StartDate: new Date(Date.now() - 200000), EndDate: new Date(Date.now() - 100000), Value: 5 };
    mockDiscount.findOne.mockResolvedValue(past);
    await expect(service.checkDiscountValidity('P')).rejects.toThrow(/expired/);
});

test('checkDiscountValidity invalid value', async () => {
    const invalid = { Code: 'I', StartDate: new Date(Date.now() - 1000), EndDate: new Date(Date.now() + 1000), Value: 0 };
    mockDiscount.findOne.mockResolvedValue(invalid);
    await expect(service.checkDiscountValidity('I')).rejects.toThrow(/Invalid discount value/);
});

test('applyDiscountToOrder percent', async () => {
    mockDiscount.findOne.mockResolvedValue({
        Code: 'PER',
        StartDate: new Date(Date.now() - 1000),
        EndDate: new Date(Date.now() + 1000),
        Value: 10,
        Type: 'Percent'
    });
    const res = await service.applyDiscountToOrder('PER', 200);
    expect(res).toBeCloseTo(180, 5);
});

test('applyDiscountToOrder fixed', async () => {
    mockDiscount.findOne.mockResolvedValue({
        Code: 'FIX',
        StartDate: new Date(Date.now() - 1000),
        EndDate: new Date(Date.now() + 1000),
        Value: 50,
        Type: 'Fixed'
    });
    const res = await service.applyDiscountToOrder('FIX', 120);
    expect(res).toBe(70);
});

test('applyDiscountToOrder throws when code missing', async () => {
    mockDiscount.findOne.mockResolvedValue(null);
    await expect(service.applyDiscountToOrder('NONE', 100)).rejects.toThrow();
});

test('getActiveDiscounts calls findAll', async () => {
    const rows = [{ ID_Discount: 1 }];
    mockDiscount.findAll.mockResolvedValue(rows);
    const res = await service.getActiveDiscounts();
    expect(mockDiscount.findAll).toHaveBeenCalled();
    expect(res).toBe(rows);
});

test('getExpiredDiscounts calls findAll', async () => {
    const rows = [{ ID_Discount: 2 }];
    mockDiscount.findAll.mockResolvedValue(rows);
    const res = await service.getExpiredDiscounts();
    expect(mockDiscount.findAll).toHaveBeenCalled();
    expect(res).toBe(rows);
});