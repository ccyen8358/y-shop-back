import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import asyncHandler from "../middleware/async-handler.js";
import { UserInsert, UserInsertSchema, UserTable } from "../db/schema/user.js";
import { hashPassword, verifyPassword } from "../utils/auth.js";
import { generateToken } from "../utils/jwt.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export interface LoginInput {
    username: string;
    password: string;
}

export interface LoginUser {
    id: number;
    username: string;
    email: string | null;
    is_admin: boolean;
}

export interface LoginSuccess {
    user: LoginUser;
    token: string;
}

/**
 * @desc Auth user & get token
 * @route POST /api/auth/login
 * @access Public
 */
const loginWithCredentials = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body as LoginInput;

    const match = await db.query.UserTable.findFirst({
        where: eq(UserTable.username, username)
    })
    if (!match || !(await verifyPassword(password, match.password || ''))) {
        res.status(StatusCodes.UNAUTHORIZED);
        throw new Error('Invalid email or password');
    }

    const user = Object.assign<{}, LoginUser>(
        {},
        {
            id: match.id,
            username: match.username,
            email: match.email,
            is_admin: match.is_admin
        }
    );
    const token = generateToken(user);

    const data = Object.assign<{}, LoginSuccess>({}, {
        user: user,
        token: token
    });
    res.json(data);
});

export type SignupInput = {
    username: string;
    password: string;
    email: string;
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req: Request, res: Response) => {
    const { username, password, email } = req.body as SignupInput;

    const match = await db.query.UserTable.findFirst({
        columns: {
            id: true,
            username: true,
        },
        where: eq(UserTable.username, username)
    });

    if (match) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error('User already exists');
    }

    const hash = await hashPassword(password);
    let insertData: UserInsert = {
        username: username,
        password: hash,
        email: email,
        is_admin: false
    };
    insertData = UserInsertSchema.parse(insertData)

    const newUser = (await db.insert(UserTable).values(insertData).returning()).at(0)!;

    const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        is_admin: newUser.is_admin
    });

    const data = Object.assign<{}, LoginSuccess>({}, {
        user: newUser,
        token: token
    });
    res.json(data);
});

export {
    loginWithCredentials,
    signup
};