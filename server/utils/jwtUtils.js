import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (id) => {
    return jwt.sign({ user_id: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export const generateResetToken = (id) => {
    return jwt.sign({ user_id: id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

export const verifyResetToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}