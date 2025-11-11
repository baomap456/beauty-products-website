const mockFavorite = {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn()
};
const mockProduct = {};

jest.mock('../../models', () => ({
    Favorite: mockFavorite,
    Product: mockProduct
}));

const service = require('../favorite.service');

beforeEach(() => {
    jest.clearAllMocks();
});

test('addFavorite - creates when not exists', async () => {
    mockFavorite.findOne.mockResolvedValue(null);
    const created = { ID_Favorite: 1, User_ID: 10, Product_ID: 5 };
    mockFavorite.create.mockResolvedValue(created);

    const res = await service.addFavorite(10, 5);

    expect(mockFavorite.findOne).toHaveBeenCalledWith({ where: { User_ID: 10, Product_ID: 5 } });
    expect(mockFavorite.create).toHaveBeenCalledWith({ User_ID: 10, Product_ID: 5 });
    expect(res).toBe(created);
});

test('addFavorite - throws when already exists', async () => {
    mockFavorite.findOne.mockResolvedValue({ ID_Favorite: 99 });
    await expect(service.addFavorite(10, 5)).rejects.toThrow(/Favorite already exists/i);
});

test('removeFavorite - returns deletedCount', async () => {
    mockFavorite.destroy.mockResolvedValue(1);
    const res = await service.removeFavorite(10, 5);
    expect(mockFavorite.destroy).toHaveBeenCalledWith({ where: { User_ID: 10, Product_ID: 5 } });
    expect(res).toBe(1);
});

test('getFavoritesByUser - returns list with include Product', async () => {
    const rows = [{ ID_Favorite: 1 }];
    mockFavorite.findAll.mockResolvedValue(rows);

    const res = await service.getFavoritesByUser(10);

    expect(mockFavorite.findAll).toHaveBeenCalledWith({
        where: { User_ID: 10 },
        include: [{ model: mockProduct }]
    });
    expect(res).toBe(rows);
});

test('isFavoriteExists - true when found', async () => {
    mockFavorite.findOne.mockResolvedValue({ ID_Favorite: 1 });
    const res = await service.isFavoriteExists(10, 5);
    expect(mockFavorite.findOne).toHaveBeenCalledWith({ where: { User_ID: 10, Product_ID: 5 } });
    expect(res).toBe(true);
});

test('isFavoriteExists - false when not found', async () => {
    mockFavorite.findOne.mockResolvedValue(null);
    const res = await service.isFavoriteExists(10, 5);
    expect(res).toBe(false);
});

test('countFavoritesByProduct - returns count', async () => {
    mockFavorite.count.mockResolvedValue(7);
    const res = await service.countFavoritesByProduct(5);
    expect(mockFavorite.count).toHaveBeenCalledWith({ where: { Product_ID: 5 } });
    expect(res).toBe(7);
});