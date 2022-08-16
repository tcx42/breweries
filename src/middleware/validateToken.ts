import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import prisma from '../database/prisma';
import config from '../config';

export function validateToken() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers['authorization'];
            if (!token) throw new ApiError(401, 'No token provided');
            jwt.verify(token, config.app.jwtPrivateKey, async (error, decoded) => {
                try {
                    if (error || decoded == undefined) throw new ApiError(401, 'Invalid token');
                    const user = await prisma.user.findFirst({
                        where: { username: (decoded as jwt.JwtPayload).username }
                    });
                    if (!user) throw new ApiError(401, 'Invalid Token');
                    next();
                } catch (error) {
                    next(error)
                }
            });
        } catch (error) {
            next(error);
        }
    }
}