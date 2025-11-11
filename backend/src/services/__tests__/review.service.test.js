const mockReview = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),          // thêm
    count: jest.fn(),
    destroy: jest.fn()
};
const mockOrder = { findOne: jest.fn() };
const mockProduct = {};

jest.mock('../../models', () => ({
    Review: mockReview,
    Order: mockOrder,
    Product: mockProduct,
    Sequelize: {
        fn: jest.fn((name, arg) => `${name}(${arg})`),
        col: jest.fn((c) => c),
        literal: jest.fn((s) => s)
    }
}));

const service = require('../review.service');

beforeEach(() => {
    jest.clearAllMocks();
});

test('createReview - success when order exists', async () => {
    mockOrder.findOne.mockResolvedValue({ id: 1, Status: 'completed' });
    const created = { ID_Review: 1, Product_ID: 10, Rating: 5, User_ID: 2 };
    mockReview.create.mockResolvedValue(created);

    const res = await service.createReview(2, { productId: 10, rating: 5, orderId: 1 });
    expect(mockOrder.findOne).toHaveBeenCalledWith({
        where: { id: 1, User_ID: 2, Status: 'completed' }
    });
    expect(mockReview.create).toHaveBeenCalled();
    expect(res).toBe(created);
});

test('createReview - throws when order not found or not completed', async () => {
    mockOrder.findOne.mockResolvedValue(null);
    await expect(service.createReview(2, { productId: 10, rating: 5, orderId: 99 })).rejects.toThrow(/Order not found/i);
});

test('getReviewByProduct - returns reviews', async () => {
    const arr = [{ ID_Review: 1 }];
    mockReview.findAll.mockResolvedValue(arr);
    const res = await service.getReviewByProduct(10);
    expect(mockReview.findAll).toHaveBeenCalledWith({ where: { Product_ID: 10 } });
    expect(res).toBe(arr);
});

test('getReviewByUser - returns reviews', async () => {
    const arr = [{ ID_Review: 2 }];
    mockReview.findAll.mockResolvedValue(arr);
    const res = await service.getReviewByUser(5);
    expect(mockReview.findAll).toHaveBeenCalledWith({ where: { User_ID: 5 } });
    expect(res).toBe(arr);
});

test('updateReview - success when exists', async () => {
    const fake = { ID_Review: 3, update: jest.fn().mockResolvedValue({ ID_Review: 3, Rating: 4 }) };
    mockReview.findByPk.mockResolvedValue(fake);
    const res = await service.updateReview(3, { Rating: 4 });
    expect(mockReview.findByPk).toHaveBeenCalledWith(3);
    expect(fake.update).toHaveBeenCalledWith({ Rating: 4 });
    expect(res).toEqual(fake);
});

test('updateReview - throws when not found', async () => {
    mockReview.findByPk.mockResolvedValue(null);
    await expect(service.updateReview(99, { Rating: 1 })).rejects.toThrow(/Review not found/i);
});

test('deleteReview - success destroys when found', async () => {
    const fake = { destroy: jest.fn().mockResolvedValue() };
    mockReview.findByPk.mockResolvedValue(fake);
    const res = await service.deleteReview(4);
    expect(mockReview.findByPk).toHaveBeenCalledWith(4);
    expect(fake.destroy).toHaveBeenCalled();
    expect(res).toBeUndefined();
});

test('deleteReview - throws when not found', async () => {
    mockReview.findByPk.mockResolvedValue(null);
    await expect(service.deleteReview(999)).rejects.toThrow(/Review not found/i);
});

test('getAVGReviewByProduct - returns rounded average number', async () => {
    mockReview.findOne.mockResolvedValue({ avgRating: '4.23' });
    const res = await service.getAVGReviewByProduct(10);
    expect(mockReview.findOne).toHaveBeenCalledWith(expect.objectContaining({
        attributes: expect.any(Array),
        where: { Product_ID: 10 },
        raw: true
    }));
    expect(typeof res).toBe('number');
    expect(res).toBeCloseTo(4.2, 1); // 4.23 -> 4.2
});

test('getAVGReviewByProduct - no reviews returns 0', async () => {
    mockReview.findOne.mockResolvedValue(null);
    const res = await service.getAVGReviewByProduct(11);
    expect(res).toBe(0);
});

test('getReviewStats - returns count and avg', async () => {
    mockReview.count.mockResolvedValue(12);
    mockReview.findOne.mockResolvedValue({ avgRating: '4.56' });
    const res = await service.getReviewStats(10);
    expect(mockReview.count).toHaveBeenCalledWith({ where: { productId: 10 } });
    expect(res).toEqual({ productId: 10, totalReviews: 12, avgRating: 4.6 });
});

test('getTopReviews - returns top reviews array', async () => {
    const rows = [{ Product_ID: 1, avgRating: '5.0', totalReviews: '3', 'Product.Name_Product': 'ABC' }];
    mockReview.findAll.mockResolvedValue(rows);
    const res = await service.getTopReviews(3);
    expect(mockReview.findAll).toHaveBeenCalledWith(expect.objectContaining({
        attributes: expect.any(Array),
        include: expect.any(Array),
        group: expect.any(Array),
        order: expect.any(Array),
        limit: 3,
        raw: true
    }));
    expect(res).toBe(rows);
});