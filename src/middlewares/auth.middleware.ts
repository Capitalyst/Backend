import { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "../utils/jwt.util";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";

// Auth Middleware
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return next({ status: 401, message: "No token provided" });
    }

    const decoded = verifyJwtToken(token, next) as unknown as JwtPayload;

    if (decoded instanceof Error) {
        return next({ status: 401, message: "Invalid token" });
    }

    try {
        const user: IUser | null = await User.findOne({ _id: decoded }).select('-password');
        if (!user) {
            return next({ status: 401, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Something went wrong:", error);
        return next({ status: 500, message: "Internal server error" });
    }
}

// Admin Auth Middleware
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    auth(req, res, (err) => {
        if (err) {
            return next(err);
        }

        const user = req.user;

        if (!user || !user.role || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied, admin only' });
        }

        next();
    });
}