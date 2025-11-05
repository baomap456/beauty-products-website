import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const jwtConfig = {
    sign: (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN }),

    verify: (token) => {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return null;
        }
    },
};
