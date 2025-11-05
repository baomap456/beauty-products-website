const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

function signToken({ userId, role, extra = {} }) {
    // payload chỉ chứa dữ liệu cần thiết
    const payload = {
        sub: String(userId),   // subject: id người dùng
        role,                  // vai trò (ví dụ 'admin'/'user')
        ...extra,              // chỉ thêm những claim không nhạy cảm
        jti: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` // unique id
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, issuer: 'beauty-products' });
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Thiếu header Authorization' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Thiếu token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào request để controller dùng
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

        const user = await User.findByPk(req.user.id, { include: Role });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Kiểm tra vai trò
        if (user.Role && user.Role.Name_Role === 'Admin') {
            return next();
        } else {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Authorization error' });
    }
};

module.exports = { signToken, verifyToken, isAdmin };