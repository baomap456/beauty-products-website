const cartService = require('../src/services/cart.service');

jest.mock('../src/services/cart.service', () => ({
    getCartByUser: jest.fn(),
    addItemToCart: jest.fn(),
    updateCartItem: jest.fn(),
    removeCartItem: jest.fn(),
    clearCart: jest.fn()
}));

const cartController = require('../src/controllers/cart.controller');

function makeReq(userId, body = {}, params = {}) {
    return { user: { sub: userId }, body, params };
}
function makeRes() {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    res.send = jest.fn(() => res);
    return res;
}

beforeEach(() => {
    jest.clearAllMocks();
});

test('getMyCart returns cart for authenticated user', async () => {
    const req = makeReq(10);
    const res = makeRes();
    cartService.getCartByUser.mockResolvedValue({ ID_Cart: 1, items: [] });

    await cartController.getMyCart(req, res);

    expect(cartService.getCartByUser).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ID_Cart: 1 }));
});

test('addItem returns 401 if not authenticated', async () => {
    const req = { user: null, body: { productId: 1 } };
    const res = makeRes();

    await cartController.addItem(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
});