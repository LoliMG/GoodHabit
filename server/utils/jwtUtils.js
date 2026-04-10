import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (id) => {
    return jwt.sign({ user_id: id }, process.env.SECRET_TOKEN_KEY, { expiresIn: "1h" });
}

/* export const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_TOKEN_KEY);
} */