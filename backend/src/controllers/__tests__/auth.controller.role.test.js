const OLD_ENV = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, JWT_SECRET: 'test-secret', JWT_EXPIRES_IN: '1h' };

    // mock the service BEFORE requiring the controller
    jest.doMock('../../services/auth.service', () => ({
        register: jest.fn(),
        login: jest.fn(),
        getUserProfile: jest.fn()
    }));
});

afterAll(() => {
    process.env = OLD_ENV;
    jest.resetModules();
});

describe('auth.controller (role-related)', () => {
    let authService;
    let controller;

    function mockRes() {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    }

    beforeEach(() => {
        authService = require('../../services/auth.service');
        controller = require('../auth.controller');
    });

    afterEach(() => jest.clearAllMocks());

    test('login controller should return payload including user.Role_ID', async () => {
        const fakeUser = { ID_User: 7, Email: 'a@b.com', Role_ID: 1 };
        const payload = { accessToken: 'tok', tokenType: 'Bearer', expiresIn: '1h', user: fakeUser };
        authService.login.mockResolvedValue(payload);

        const req = { body: { Email: 'a@b.com', Password: 'p', email: 'a@b.com', password: 'p' } };
        const res = mockRes();
        const next = jest.fn();

        await controller.login(req, res, next);

        const callArg = res.json.mock.calls[0][0];
        // allow extra wrapper fields (e.g. message), only assert payload fields are present
        expect(callArg).toEqual(expect.objectContaining(payload));
        expect(callArg.user).toHaveProperty('Role_ID', 1);
    });

    test('register controller should return created user with Role_ID (if service provides it)', async () => {
        const created = { ID_User: 8, Email: 'u@u.com', Role_ID: 2 };
        authService.register.mockResolvedValue(created);

        const req = { body: { Email: 'u@u.com', Password: 'p', email: 'u@u.com', password: 'p' } };
        const res = mockRes();
        const next = jest.fn();

        await controller.register(req, res, next);

        const callArg = res.json.mock.calls[0][0];
        // controller may return the user directly or wrap it; accept both
        if (callArg.ID_User) {
            expect(callArg).toEqual(expect.objectContaining(created));
        } else {
            expect(callArg).toEqual(expect.objectContaining({ user: expect.objectContaining(created) }));
        }
    });
});