const mockAddress = {
    update: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn()
};

// correct relative path from this test file to src/models
jest.mock('../../models', () => ({ Address: mockAddress }));

// correct require path to the service under test
const addressService = require('../address.service');

beforeEach(() => {
    jest.clearAllMocks();
});

test('createAddress - sets other addresses IsDefault=false when data.IsDefault true and creates address', async () => {
    const userId = 10;
    const data = { Street: 'A', IsDefault: true };
    mockAddress.create.mockResolvedValue({ ID_Address: 1, ...data, User_ID: userId });

    const res = await addressService.createAddress(userId, data);

    expect(mockAddress.update).toHaveBeenCalledWith({ IsDefault: false }, { where: { User_ID: userId } });
    expect(mockAddress.create).toHaveBeenCalledWith(expect.objectContaining({ Street: 'A', IsDefault: true, User_ID: userId }));
    expect(res).toEqual(expect.objectContaining({ ID_Address: 1 }));
});

test('getAddressById - returns address from findByPk', async () => {
    mockAddress.findByPk.mockResolvedValue({ ID_Address: 2 });
    const res = await addressService.getAddressById(2);
    expect(mockAddress.findByPk).toHaveBeenCalledWith(2);
    expect(res).toEqual({ ID_Address: 2 });
});

test('getAddressByUserId - returns list from findAll', async () => {
    mockAddress.findAll.mockResolvedValue([{ ID_Address: 3 }]);
    const res = await addressService.getAddressByUserId(7);
    expect(mockAddress.findAll).toHaveBeenCalledWith({ where: { User_ID: 7 } });
    expect(res).toEqual([{ ID_Address: 3 }]);
});

test('updateAddress - throws when address not found', async () => {
    mockAddress.findOne.mockResolvedValue(null);

    await expect(addressService.updateAddress(5, 2, { Street: 'B', IsDefault: false })).rejects.toThrow(/Address not found/i);
    expect(mockAddress.findOne).toHaveBeenCalledWith({ where: { ID_Address: 5, User_ID: 2 } });
});

test('updateAddress - updates and returns updated address', async () => {
    const fakeAddress = { ID_Address: 6, update: jest.fn().mockResolvedValue({ ID_Address: 6, Street: 'C' }) };
    mockAddress.findOne.mockResolvedValue(fakeAddress);
    const res = await addressService.updateAddress(6, 2, { Street: 'C' });
    expect(fakeAddress.update).toHaveBeenCalledWith({ Street: 'C' });
    expect(res).toEqual({ ID_Address: 6, Street: 'C' });
});

test('deleteAddress - throws when not found', async () => {
    mockAddress.findOne.mockResolvedValue(null);
    await expect(addressService.deleteAddress(9, 4)).rejects.toThrow(/Address not found/i);
});

test('deleteAddress - destroys and returns true when found', async () => {
    const fakeAddress = { destroy: jest.fn().mockResolvedValue() };
    mockAddress.findOne.mockResolvedValue(fakeAddress);
    const res = await addressService.deleteAddress(8, 4);
    expect(fakeAddress.destroy).toHaveBeenCalled();
    expect(res).toBe(true);
});