const mockDb = {
    Order: { create: jest.fn(), findByPk: jest.fn() },
    OrderDetail: { create: jest.fn() },
    Cart: { findOne: jest.fn(), update: jest.fn(), findByPk: jest.fn(), primaryKeyAttribute: 'ID_Cart' },
    CartItem: { findAll: jest.fn(), destroy: jest.fn() },
    Payment: { create: jest.fn(), update: jest.fn() },
    Discount: { findByPk: jest.fn() },
    Product: {},
    // make transaction pass a fake transaction object to the callback
    sequelize: { transaction: jest.fn(async (cb) => cb({ transaction: {} })) }
};

jest.mock('../src/models', () => mockDb, { virtual: true });

const orderService = require('../src/services/order.service');

beforeEach(() => {
    Object.values(mockDb).forEach(v => {
        if (typeof v === 'object') Object.values(v).forEach(fn => fn && fn.mockClear && fn.mockClear());
    });
    mockDb.sequelize.transaction.mockClear();
    // silence console.error in tests to reduce noise
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
    console.error.mockRestore && console.error.mockRestore();
});

test('createOrderFromCart creates order, orderDetails, updates cart and clears items', async () => {
    const userId = 2;
    const cart = { ID_Cart: 300, User_ID: userId, Status: 'active', update: jest.fn() };
    const items = [
        { Product_ID: 1, Quantity: 2, Price: 10 },
        { Product_ID: 2, Quantity: 1, Price: 20 }
    ];
    mockDb.Cart.findOne.mockResolvedValue(cart);
    mockDb.CartItem.findAll.mockResolvedValue(items);
    mockDb.Discount.findByPk.mockResolvedValue(null);
    const createdOrder = { ID_Order: 500, User_ID: userId, Total_Amount: 40 };
    mockDb.Order.create.mockResolvedValue(createdOrder);
    mockDb.Order.findByPk.mockResolvedValue(Object.assign({}, createdOrder, { orderDetails: items }));

    await expect(orderService.createOrderFromCart(userId, {})).resolves.toMatchObject({ ID_Order: 500 });

    expect(mockDb.Order.create).toHaveBeenCalledWith(expect.objectContaining({
        User_ID: userId,
        Total_Amount: 40
    }), expect.any(Object));
    expect(mockDb.OrderDetail.create).toHaveBeenCalledTimes(items.length);
    // now assert destroy was called with options object that includes transaction
    expect(mockDb.CartItem.destroy).toHaveBeenCalledWith({ where: { Cart_ID: cart.ID_Cart }, transaction: expect.any(Object) });
    expect(mockDb.Cart.findOne).toHaveBeenCalled();
});

test('createOrderFromCart throws when discount invalid', async () => {
    const userId = 2;
    const cart = { ID_Cart: 400, User_ID: userId, Status: 'active', update: jest.fn() };
    const items = [{ Product_ID: 1, Quantity: 1, Price: 10 }];
    mockDb.Cart.findOne.mockResolvedValue(cart);
    mockDb.CartItem.findAll.mockResolvedValue(items);
    // discount exists but is expired -> simulate expired by providing ExpiresAt in past
    mockDb.Discount.findByPk.mockResolvedValue({ ExpiresAt: '2000-01-01' });

    await expect(orderService.createOrderFromCart(userId, { discountId: 9 })).rejects.toThrow(/expired|DISCOUNT_EXPIRED/i);
});