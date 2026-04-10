import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (id) => {
    return jwt.sign({ user_id: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

/* export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
} */