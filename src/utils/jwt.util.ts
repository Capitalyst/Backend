import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_EXPIRE, JWT_SECRET } from '../config';
import { NextFunction } from 'express';


export const createJwtToken = (payload: JwtPayload) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    const token: string = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    return token;
}


export const verifyJwtToken = (token: string, next: NextFunction) => {
    try {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const { sub } = jwt.verify(token, JWT_SECRET);
        return sub;
    } catch (error) {
        return error;
    }
}