jest.mock('../../services/favorite.service', () => ({
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getFavoritesByUser: jest.fn(),
    countFavoritesByProduct: jest.fn(),
    isFavoriteExists: jest.fn()
}));

const svc = require('../../services/favorite.service');
const ctrl = require('../favorite.controller');

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

test('addFavorite - 201 on success', async () => {
    const req = { user: { id: 10 }, body: { productId: 5 } };
    const res = mockRes();
    const fav = { ID_Favorite: 1 };
    svc.addFavorite.mockResolvedValue(fav);

    await ctrl.addFavorite(req, res);

    expect(svc.addFavorite).toHaveBeenCalledWith(10, 5);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fav);
});

test('addFavorite - 400 when missing productId', async () => {
    const req = { user: { id: 10 }, body: {} };
    const res = mockRes();

    await ctrl.addFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing productId' });
});

test('addFavorite - 400 when service throws', async () => {
    const req = { user: { id: 10 }, body: { productId: 5 } };
    const res = mockRes();
    svc.addFavorite.mockRejectedValue(new Error('Favorite already exists'));

    await ctrl.addFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Favorite already exists' });
});

test('removeFavorite - 200 with deletedCount', async () => {
    const req = { user: { id: 10 }, body: { productId: 5 } };
    const res = mockRes();
    svc.removeFavorite.mockResolvedValue(1);

    await ctrl.removeFavorite(req, res);

    expect(svc.removeFavorite).toHaveBeenCalledWith(10, 5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ deletedCount: 1 });
});

test('removeFavorite - 404 when not found', async () => {
    const req = { user: { id: 10 }, body: { productId: 5 } };
    const res = mockRes();
    svc.removeFavorite.mockResolvedValue(0);

    await ctrl.removeFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Favorite not found' });
});

test('removeFavorite - 400 when missing productId', async () => {
    const req = { user: { id: 10 }, body: {} };
    const res = mockRes();

    await ctrl.removeFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing productId' });
});

test('getFavoritesByUser - 200 returns array', async () => {
    const req = { user: { id: 10 } };
    const res = mockRes();
    const rows = [{ ID_Favorite: 1 }];
    svc.getFavoritesByUser.mockResolvedValue(rows);

    await ctrl.getFavoritesByUser(req, res);

    expect(svc.getFavoritesByUser).toHaveBeenCalledWith(10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
});

test('countFavoritesByProduct - 200 with count', async () => {
    const req = { params: { productId: '5' } };
    const res = mockRes();
    svc.countFavoritesByProduct.mockResolvedValue(7);

    await ctrl.countFavoritesByProduct(req, res);

    expect(svc.countFavoritesByProduct).toHaveBeenCalledWith('5');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ count: 7 });
});

test('countFavoritesByProduct - 400 when missing productId', async () => {
    const req = { params: {} };
    const res = mockRes();

    await ctrl.countFavoritesByProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing productId' });
});

test('toggleFavorite - removes when exists -> 200', async () => {
    const req = { user: { id: 10 }, body: { productId: 5 } };
    const res = mockRes();
    svc.isFavoriteExists.mockResolvedValue(true);
    svc.removeFavorite.mockResolvedValue(1);

    await ctrl.toggleFavorite(req, res);

    expect(svc.isFavoriteExists).toHaveBeenCalledWith(10, 5);
    expect(svc.removeFavorite).toHaveBeenCalledWith(10, 5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Removed from favorites' });
});

test('toggleFavorite - adds when not exists -> 201', async () => {
    const req = { user: { id: 10 }, body: { productId: 5 } };
    const res = mockRes();
    const fav = { ID_Favorite: 2 };
    svc.isFavoriteExists.mockResolvedValue(false);
    svc.addFavorite.mockResolvedValue(fav);

    await ctrl.toggleFavorite(req, res);

    expect(svc.isFavoriteExists).toHaveBeenCalledWith(10, 5);
    expect(svc.addFavorite).toHaveBeenCalledWith(10, 5);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fav);
});

test('toggleFavorite - 400 when missing productId', async () => {
    const req = { user: { id: 10 }, body: {} };
    const res = mockRes();

    await ctrl.toggleFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing productId' });
});
