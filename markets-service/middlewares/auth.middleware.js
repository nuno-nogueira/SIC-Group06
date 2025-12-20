import jwt from "jsonwebtoken";
import 'dotenv/config'; 
import logger from '../utils/logger.js';


export const authenticateToken = (req) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        logger.error("Authentication error: No token provided");
        return null};

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        logger.error("Authentication error: Invalid token");
        //throw new Error(`Authentication error: ${error.message}`);
        return null;

    }
}

export const authorizeRole = (user, role) => {
    if (!user) {
        logger.error("Access denied: missing or invalid token.");
        throw new Error("Access denied: missing or invalid token.");
    }
    if (user.role !== role) {
        logger.error("Access forbidden: insufficient privileges.");
        throw new Error("Access forbidden: insufficient privileges.");
       
    }
}