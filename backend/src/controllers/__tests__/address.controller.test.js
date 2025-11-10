jest.mock('../../services/address.service', () => ({
    createAddress: jest.fn(),
    getAddressById: jest.fn(),
    getAddressByUserId: jest.fn(),
    updateAddress: jest.fn(),
    deleteAddress: jest.fn()
}));

const addressService = require('../../services/address.service');
const controller = require('../../controllers/address.controller');

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

test('createAddress - success returns 201 and created object', async () => {
    const req = { user: { id: 11 }, body: { Street: 'X', IsDefault: false } };
    const res = mockRes();
    const created = { ID_Address: 20, Street: 'X' };
    addressService.createAddress.mockResolvedValue(created);

    await controller.createAddress(req, res);

    expect(addressService.createAddress).toHaveBeenCalledWith(11, req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
});

test('createAddress - service throws -> 500', async () => {
    const req = { user: { id: 11 }, body: {} };
    const res = mockRes();
    addressService.createAddress.mockRejectedValue(new Error('fail'));

    await controller.createAddress(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
});

test('getAddress - invalid id -> 400', async () => {
    const req = { params: { id: 'abc' } };
    const res = mockRes();

    await controller.getAddress(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid address ID' });
});

test('getAddress - not found -> 404', async () => {
    const req = { params: { id: '5' } };
    const res = mockRes();
    addressService.getAddressById.mockResolvedValue(null);

    await controller.getAddress(req, res);

    expect(addressService.getAddressById).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Address not found' });
});

test('getAddress - found -> 200', async () => {
    const req = { params: { id: '5' } };
    const res = mockRes();
    const found = { ID_Address: 5 };
    addressService.getAddressById.mockResolvedValue(found);

    await controller.getAddress(req, res);

    expect(res.json).toHaveBeenCalledWith(found);
});

test('getUserAddresses - returns list', async () => {
    const req = { user: { id: 7 } };
    const res = mockRes();
    const list = [{ ID_Address: 1 }];
    addressService.getAddressByUserId.mockResolvedValue(list);

    await controller.getUserAddresses(req, res);

    expect(addressService.getAddressByUserId).toHaveBeenCalledWith(7);
    expect(res.json).toHaveBeenCalledWith(list);
});

test('updateAddress - not found -> 404', async () => {
    const req = { params: { id: '12' }, user: { id: 4 }, body: { Street: 'New' } };
    const res = mockRes();
    addressService.updateAddress.mockRejectedValue(new Error('Address not found'));

    await controller.updateAddress(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Address not found' });
});

test('updateAddress - success -> 200', async () => {
    const req = { params: { id: '12' }, user: { id: 4 }, body: { Street: 'New' } };
    const res = mockRes();
    const updated = { ID_Address: 12, Street: 'New' };
    addressService.updateAddress.mockResolvedValue(updated);

    await controller.updateAddress(req, res);

    expect(addressService.updateAddress).toHaveBeenCalledWith(12, 4, req.body);
    expect(res.json).toHaveBeenCalledWith(updated);
});

test('deleteAddress - not found -> 404', async () => {
    const req = { params: { id: '9' }, user: { id: 2 } };
    const res = mockRes();
    addressService.deleteAddress.mockRejectedValue(new Error('Address not found'));

    await controller.deleteAddress(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Address not found' });
});

test('deleteAddress - success -> 204', async () => {
    const req = { params: { id: '9' }, user: { id: 2 } };
    const res = mockRes();
    addressService.deleteAddress.mockResolvedValue(true);

    await controller.deleteAddress(req, res);

    expect(addressService.deleteAddress).toHaveBeenCalledWith(9, 2);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
});