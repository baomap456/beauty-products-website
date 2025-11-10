const orderService = require('../src/services/order.service');

jest.mock('../src/services/order.service', () => ({
    createOrderFromCart: jest.fn(),
    getOrdersByUser: jest.fn(),
    getOrderById: jest.fn()
}));

const orderController = require('../src/controllers/order.controller');

function makeReq(userId, body = {}, params = {}) {
    return { user: { sub: userId }, body, params };
}
function makeRes() {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
}

beforeEach(() => jest.clearAllMocks());

test('checkout creates order for authenticated user', async () => {
    const req = makeReq(5, { cartId: 1 });
    const res = makeRes();
    const fakeOrder = { ID_Order: 123 };
    orderService.createOrderFromCart.mockResolvedValue(fakeOrder);

    await orderController.checkout(req, res);

    expect(orderService.createOrderFromCart).toHaveBeenCalledWith(5, expect.objectContaining({ cartId: 1 }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeOrder);
});

test('myOrders returns 401 when unauthenticated', async () => {
    const req = { user: null };
    const res = makeRes();

    await orderController.myOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
});