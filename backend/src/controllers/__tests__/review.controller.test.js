jest.mock('../../services/review.service', () => ({
    createReview: jest.fn(),
    getReviewByProduct: jest.fn(),
    getReviewByUser: jest.fn(),
    updateReview: jest.fn(),
    deleteReview: jest.fn(),
    getReviewStats: jest.fn(),
    getTopReviews: jest.fn()
}));

const reviewService = require('../../services/review.service');
const controller = require('../review.controller');

function mockRes() {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    res.send = jest.fn(() => res);
    return res;
}

beforeEach(() => {
    jest.clearAllMocks();
});

test('createReview - success -> 201', async () => {
    const req = { user: { id: 7 }, body: { productId: 10, rating: 5, comment: 'ok', orderId: 1 } };
    const res = mockRes();
    const created = { ID_Review: 1, Product_ID: 10 };
    reviewService.createReview.mockResolvedValue(created);

    await controller.createReview(req, res);

    expect(reviewService.createReview).toHaveBeenCalledWith(7, { productId: 10, rating: 5, comment: 'ok', orderId: 1 });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
});

test('createReview - missing fields -> 400', async () => {
    const req = { user: { id: 7 }, body: { rating: null } };
    const res = mockRes();

    await controller.createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
});

test('createReview - service throws -> 400 with error message', async () => {
    const req = { user: { id: 7 }, body: { productId: 1, rating: 5 } };
    const res = mockRes();
    reviewService.createReview.mockRejectedValue(new Error('fail'));

    await controller.createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
});

test('getReviewsByProduct - success -> 200', async () => {
    const req = { params: { productId: '10' } };
    const res = mockRes();
    const arr = [{ ID_Review: 1 }];
    reviewService.getReviewByProduct.mockResolvedValue(arr);

    await controller.getReviewsByProduct(req, res);

    expect(reviewService.getReviewByProduct).toHaveBeenCalledWith('10');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(arr);
});

test('getReviewsByUser - success -> 200', async () => {
    const req = { user: { id: 3 } };
    const res = mockRes();
    const arr = [{ ID_Review: 2 }];
    reviewService.getReviewByUser.mockResolvedValue(arr);

    await controller.getReviewsByUser(req, res);

    expect(reviewService.getReviewByUser).toHaveBeenCalledWith(3);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(arr);
});

test('updateReview - success -> 200', async () => {
    const req = { params: { reviewId: '5' }, user: { id: 3 }, body: { comment: 'updated' } };
    const res = mockRes();
    const updated = { ID_Review: 5, comment: 'updated' };
    reviewService.updateReview.mockResolvedValue(updated);

    await controller.updateReview(req, res);

    expect(reviewService.updateReview).toHaveBeenCalledWith('5', 3, { comment: 'updated' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
});

test('deleteReview - success -> 204', async () => {
    const req = { params: { reviewId: '8' }, user: { id: 4 } };
    const res = mockRes();
    reviewService.deleteReview.mockResolvedValue();

    await controller.deleteReview(req, res);

    expect(reviewService.deleteReview).toHaveBeenCalledWith('8', 4);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
});

test('getReviewStats - success -> 200', async () => {
    const req = { params: { productId: '10' } };
    const res = mockRes();
    const stats = { productId: '10', totalReviews: 7, avgRating: '4.0' };
    reviewService.getReviewStats.mockResolvedValue(stats);

    await controller.getReviewStats(req, res);

    expect(reviewService.getReviewStats).toHaveBeenCalledWith('10');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(stats);
});

test('getTopReviews - success -> 200', async () => {
    const req = { query: { limit: '2' } };
    const res = mockRes();
    const rows = [{ Product_ID: 1, avgRating: '5.0' }];
    reviewService.getTopReviews.mockResolvedValue(rows);

    await controller.getTopReviews(req, res);

    expect(reviewService.getTopReviews).toHaveBeenCalledWith(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
});