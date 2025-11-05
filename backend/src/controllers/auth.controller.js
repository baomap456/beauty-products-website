const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const userData = req.body;
        if (!userData.Email || !userData.Password) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
        const newUser = await authService.register(userData);

        res.status(201).json({
            message: 'Đăng ký thành công!',
            user: newUser,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Đăng ký thất bại',
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
        }

        const result = await authService.login(email, password);

        res.status(200).json({
            message: 'Đăng nhập thành công!',
            ...result, // accessToken, tokenType, expiresIn, user
        });
    } catch (error) {
        res.status(401).json({
            message: error.message || 'Đăng nhập thất bại',
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.sub; // lấy từ middleware verifyToken
        if (!userId) {
            return res.status(401).json({ message: 'Không xác định được người dùng' });
        }

        const user = await authService.getUserProfile(userId);

        res.status(200).json({
            message: 'Lấy thông tin người dùng thành công!',
            user,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message || 'Không tìm thấy người dùng',
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
};
