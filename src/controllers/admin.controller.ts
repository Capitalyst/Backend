import { Request, Response, NextFunction } from "express"
import User from "../models/user.model";
import { createJwtToken } from "../utils/jwt.util";
import LearningModule from "../models/learningmodule.model";


// ----------------- Authetication -------------------
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next({ status: 401, message: 'email and password are required' });
        }

        const user = await User.findOne({ email, password });
        if (!user) {
            return next({ status: 401, message: 'Invalid email or password' });
        }

        // Generate JWT token
        const payload = {
            sub: user.id,
            role: user.role
        }

        const token = createJwtToken(payload);
        return res.status(200).json({
            type: 'success',
            message: 'Login successful',
            data: { token }
        });

    } catch (error) {
        next(error);
    }
}
