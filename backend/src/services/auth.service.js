const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const User = db.User;
const Role = db.Role;

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

async function register(userData) {
    // check email tồn tại
    const existingUser = await User.findOne({ where: { Email: userData.Email } });
    if (existingUser) {
        throw new Error('Email đã được sử dụng');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(userData.Password, 10);

    // tạo user
    const newUser = await User.create({
        FullName: userData.FullName,
        Email: userData.Email,
        Password: hashedPassword,
        Phone: userData.Phone,
        Role_ID: userData.Role_ID || 2   // mặc định là customer
    });

    const safe = newUser.toJSON();
    delete safe.Password;

    return safe;
}

async function login(Email, Password) {

    const user = await User.findOne({ where: { Email } });
    if (!user) {
        throw new Error('Thông tin đăng nhập không chính xác');
    }

    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
        throw new Error('Thông tin đăng nhập không chính xác');
    }

    // Lấy ID_User đúng
    const userId = user.ID_User;

    const payload = {
        sub: String(userId),
        email: user.Email,
        role: user.Role_ID,
        jti: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'beauty-products'
    });

    const safeUser = user.toJSON();
    delete safeUser.Password;

    return {
        accessToken: token,
        tokenType: 'Bearer',
        expiresIn: JWT_EXPIRES_IN,
        user: safeUser,
    };
}

async function getUserProfile(userId) {
    const user = await User.findByPk(userId, {
        include: [{ model: Role, attributes: ['Name'] }],
        attributes: { exclude: ['Password'] }
    });

    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }

    return user;
}

module.exports = { register, login, getUserProfile };
