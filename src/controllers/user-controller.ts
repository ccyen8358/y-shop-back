import db from "../database/database.js";
import asyncHandler from "../middleware/async-handler.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/auth.js";
import { UserInsert, UserUpdate } from "../database/user-model.js";
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from "express";
import { ApiResponse } from "../typings/express.js";

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginUser {
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
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
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginInput;

    const match = await db.selectFrom('user')
        .where('email', '=', email)
        .where('provider', '=', 'local')
        .select(['id', 'email', 'password', 'name', 'isAdmin'])
        .executeTakeFirst();
    if (!match || !(await verifyPassword(password, match.password))) {
        res.status(StatusCodes.UNAUTHORIZED);
        throw new Error('Invalid email or password');
    }

    const user = Object.assign<{}, LoginUser>(
        {},
        {
            id: match.id,
            email: match.email,
            name: match.name,
            isAdmin: match.isAdmin
        }
    );
    const token = generateToken(user);

    const data = Object.assign<{}, LoginSuccess>({}, {
        user: user,
        token: token
    });
    res.json(data);
});

export interface SignupInput {
    email: string;
    password: string;
    name: string;
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const signupUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body as SignupInput;

    const match = await db.selectFrom('user')
        .where('email', '=', email)
        .select(['id', 'email', 'password', 'name', 'isAdmin'])
        .executeTakeFirst();
    if (match) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error('User already exists');
    }

    const hash = await hashPassword(password);
    const insertData = Object.assign<{}, UserInsert>(
        {},
        {
            email: email,
            password: hash,
            name: name,
            isAdmin: false,
            provider: 'local'
        }
    );

    const user = await db.insertInto('user')
        .values(insertData)
        .returningAll()
        .executeTakeFirstOrThrow();

    const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
    });

    const data = Object.assign<{}, LoginSuccess>({}, {
        user: user,
        token: token
    });
    res.json(data);
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getLoginUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await db.selectFrom('user')
        .where('id', '=', req.user!.id)
        .select(['id', 'email', 'password', 'name', 'isAdmin'])
        .executeTakeFirst();

    if (dbUser) {
        const user = Object.assign<{}, LoginUser>(
            {},
            {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                isAdmin: dbUser.isAdmin
            }
        );
        res.json(user);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User profile not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateLoginUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await db.selectFrom('user')
        .where('id', '=', req.user!.id)
        .select(['id', 'email', 'password', 'name', 'isAdmin'])
        .executeTakeFirst();

    if (dbUser) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User profile not found');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUserList = asyncHandler(async (req: Request, res: Response) => {
    const data = await db.selectFrom('user')
        .select(['id', 'email', 'name', 'isAdmin', 'provider', 'created_at'])
        .execute();

    res.json(data);
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    if (!userId) {
        res.status(StatusCodes.BAD_REQUEST);
        throw Error("invalid userId");
    }

    const user = await db.selectFrom('user')
        .where('id', '=', userId)
        .select(['id', 'isAdmin'])
        .executeTakeFirst();

    if (user) {
        if (user.isAdmin) {
            res.status(StatusCodes.BAD_REQUEST);
            throw new Error('Can not delete admin user');
        }
        await db.deleteFrom('user')
            .where('id', '=', userId)
            .returning(['id'])
            .executeTakeFirst();
        res.json({ message: 'User removed' });
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    if (!userId) {
        res.status(StatusCodes.BAD_REQUEST);
        throw Error("invalid userId");
    }

    const user = await db.selectFrom('user')
        .where('id', '=', userId)
        .select(['id', 'email', 'name', 'isAdmin', 'provider', 'provider'])
        .executeTakeFirst();

    if (user) {
        res.json(user);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    if (!userId) {
        res.status(StatusCodes.BAD_REQUEST);
        throw Error("invalid userId");
    }

    const body = req.body as UserUpdate;
    const updateData = Object.assign<{}, UserUpdate>(
        {},
        {
            email: body.email,
            name: body.name,
            isAdmin: body.isAdmin
        }
    )

    const user = await db.updateTable('user')
        .set(updateData)
        .where('id', '=', userId)
        .returning(['id'])
        .executeTakeFirst();

    if (user) {
        res.json(Object.assign<{}, ApiResponse>(
            {},
            {
                message: 'User updated',
            })
        );
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User not found');
    }
});

export {
    loginUser,
    signupUser,
    getLoginUserProfile,
    updateUserProfile,
    getUserList,
    deleteUser,
    getUserById,
    updateUser,
};
