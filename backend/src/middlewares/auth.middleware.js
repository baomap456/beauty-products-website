import { jwtConfig } from "../config/jwt.js";
import db from "../models/index.js";

const User = db.User;

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Không có token hoặc token không hợp lệ" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtConfig.verify(token);

    if (!decoded) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    const user = await User.findByPk(decoded.ID_User);
    if (!user) {
        return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    req.user = user; // gắn user vào request
    next();
};


