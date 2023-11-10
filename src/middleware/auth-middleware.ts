import jwt from 'jsonwebtoken';
import asyncHandler from './async-handler.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// User must be authenticated
const isLoggedIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (token == null) {
        res.status(StatusCodes.UNAUTHORIZED);
        throw Error('Not authorized');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as any);
        req.user = decoded as any;
        next()
    }
    catch (err) {
        res.status(StatusCodes.UNAUTHORIZED);
        throw Error('Invalid authorized');
    }
});

// User must be an admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.is_admin) {
        next();
    } else {
        res.status(StatusCodes.FORBIDDEN);
        throw new Error('Not authorized as an admin');
    }
};

export { isLoggedIn, isAdmin };
