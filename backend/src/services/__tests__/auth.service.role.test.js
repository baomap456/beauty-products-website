const jwt = require('jsonwebtoken');

const OLD_ENV = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, JWT_SECRET: 'test-secret', JWT_EXPIRES_IN: '1h' };

    // mock bcryptjs and models BEFORE requiring the service
    jest.doMock('bcryptjs', () => ({
        hash: jest.fn().mockResolvedValue('hashed-pass'),
        compare: jest.fn().mockResolvedValue(true)
    }));

    jest.doMock('../../models', () => ({
        User: {
            findOne: jest.fn(),
            create: jest.fn(),
            findByPk: jest.fn(),
        },
        Role: {}
    }));
});

afterAll(() => {
    process.env = OLD_ENV;
    jest.resetModules();
});

describe('auth.service (role-related)', () => {
    let db;
    let register;
    let login;
    let getUserProfile;
    let bcrypt;

    beforeEach(() => {
        db = require('../../models');
        bcrypt = require('bcryptjs');
        ({ register, login, getUserProfile } = require('../auth.service'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('login should include Role_ID as "role" claim in JWT', async () => {
        const fakeUser = {
            ID_User: 42,
            Email: 'admin@example.com',
            Password: 'hashed',
            Role_ID: 1,
            toJSON() { return { ID_User: 42, Email: 'admin@example.com', Password: 'hashed', Role_ID: 1 }; }
        };

        db.User.findOne.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(true);

        const result = await login('admin@example.com', 'password');
        expect(result).toHaveProperty('accessToken');

        const decoded = jwt.verify(result.accessToken, process.env.JWT_SECRET);
        expect(decoded).toHaveProperty('role', fakeUser.Role_ID);
        expect(decoded).toHaveProperty('sub', String(fakeUser.ID_User));
    });

    test('register should set default Role_ID = 2 when not provided', async () => {
        db.User.findOne.mockResolvedValue(null);

        const created = {
            ID_User: 100,
            FullName: 'User',
            Email: 'user@example.com',
            Password: 'hashed',
            Role_ID: 2,
            toJSON() { return { ID_User: 100, FullName: 'User', Email: 'user@example.com', Password: 'hashed', Role_ID: 2 }; }
        };
        db.User.create.mockResolvedValue(created);
        // bcrypt.hash is already mocked to 'hashed-pass' by jest.doMock

        const safe = await register({ FullName: 'User', Email: 'user@example.com', Password: 'plain' });
        expect(safe).toHaveProperty('Role_ID', 2);
        expect(safe).not.toHaveProperty('Password');
        expect(db.User.create).toHaveBeenCalledWith(expect.objectContaining({ Role_ID: 2 }));
    });
});