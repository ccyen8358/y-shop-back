import jwt from 'jsonwebtoken';
import { LoginUser } from '../controllers/user-controller.js';


export const generateToken = (user: LoginUser) => {
    const token = jwt.sign(user, process.env.JWT_SECRET as any, {
        expiresIn: '30d',
    });
    return token;

    // // Set JWT as an HTTP-Only cookie
    // res.cookie('jwt', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    //     sameSite: 'strict', // Prevent CSRF attacks
    //     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // });
};
