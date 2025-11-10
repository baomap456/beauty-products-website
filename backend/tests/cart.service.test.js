const mockDb = {
    Cart: {
        findOne: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
        primaryKeyAttribute: 'ID_Cart'
    },
    CartItem: {
        findOne: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn()
    },
    Product: {
        findByPk: jest.fn()
    },
    // pass fake transaction object to callback
    sequelize: {
        transaction: jest.fn(async (cb) => cb({ transaction: {} }))
    }
};

jest.mock('../src/models', () => mockDb, { virtual: true });

const cartService = require('../src/services/cart.service');

beforeEach(() => {
    Object.values(mockDb.Cart).forEach(v => typeof v === 'function' && v.mockClear && v.mockClear());
    Object.values(mockDb.CartItem).forEach(v => typeof v === 'function' && v.mockClear && v.mockClear());
    Object.values(mockDb.Product).forEach(v => typeof v === 'function' && v.mockClear && v.mockClear());
    mockDb.sequelize.transaction.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
    console.error.mockRestore && console.error.mockRestore();
});

test('addItemToCart creates cart and cart item when none exists and updates total', async () => {
    // Arrange
    const userId = 1;
    const productId = 10;
    const quantity = 2;
    const fakeCart = { ID_Cart: 100, User_ID: userId, Status: 'active', save: jest.fn() };
    const fakeProduct = { Price: 50 };
    mockDb.Cart.findOne.mockResolvedValue(null);
    mockDb.Cart.create.mockResolvedValue(fakeCart);
    mockDb.Product.findByPk.mockResolvedValue(fakeProduct);
    mockDb.CartItem.findOne.mockResolvedValue(null);
    const createdItem = { ID_CartItem: 5, Cart_ID: 100, Product_ID: productId, Quantity: quantity, Price: 50 };
    mockDb.CartItem.create.mockResolvedValue(createdItem);
    mockDb.CartItem.findAll.mockResolvedValue([createdItem]);

    // Act
    const result = await cartService.addItemToCart(userId, productId, quantity);

    // Assert
    expect(mockDb.Cart.create).toHaveBeenCalled();
    expect(mockDb.Product.findByPk).toHaveBeenCalledWith(productId, expect.any(Object));
    expect(mockDb.CartItem.create).toHaveBeenCalledWith(expect.objectContaining({
        Cart_ID: fakeCart.ID_Cart,
        Product_ID: productId,
        Quantity: quantity,
        Price: 50
    }), expect.any(Object));
    expect(result.cart.Total).toBeDefined();
    expect(result.item).toEqual(createdItem);
});

test('updateCartItem with quantity 0 removes item and recalculates total', async () => {
    const userId = 1;
    const cartItemId = 7;
    const fakeItem = { ID_CartItem: cartItemId, Cart_ID: 200, Product_ID: 11, Quantity: 2, Price: 10, destroy: jest.fn() };
    const fakeCart = { ID_Cart: 200, User_ID: userId, Status: 'active', save: jest.fn() };

    mockDb.CartItem.findByPk.mockResolvedValue(fakeItem);
    mockDb.Cart.findByPk.mockResolvedValue(fakeCart);
    mockDb.CartItem.destroy.mockResolvedValue(1);
    mockDb.CartItem.findAll.mockResolvedValue([]); // after delete no items

    const result = await cartService.updateCartItem(userId, cartItemId, 0);

    // after removing item, cart.Total should be recalculated to 0
    const updatedCart = result.cart || fakeCart;
    expect(mockDb.CartItem.findByPk).toHaveBeenCalledWith(cartItemId, expect.any(Object));
    expect(updatedCart.Total).toBe(0);
});