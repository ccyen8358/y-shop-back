import asyncHandler from "../middleware/async-handler.js";
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from "express";
import { db } from "../db/index.js";
import { and, eq } from "drizzle-orm";
import { UserTable } from "../db/schema/user.js";

/**
 * @desc Get all users
 * @route GET /api/user/list
 * @access Public
 */
const getUserList = asyncHandler(async (req: Request, res: Response) => {
    const data = await db.query.UserTable.findMany({
        columns: {
            password: false
        }
    });

    res.json(data);
});

/**
 * @desc    Delete user
 * @route   DELETE /api/user/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    if (!userId) {
        res.status(StatusCodes.BAD_REQUEST);
        throw Error("invalid userId");
    }

    const user = await db.query.UserTable.findFirst({
        columns: {
            id: true,
            is_admin: true
        },
        where: eq(UserTable.id, userId)
    });

    if (user) {
        if (user.is_admin) {
            res.status(StatusCodes.BAD_REQUEST);
            throw new Error('Can not delete admin user');
        }
        await db.delete(UserTable).where(eq(UserTable.id, userId));
        res.json({ message: 'User removed' });
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User not found');
    }
});


/**
 * @desc    get user
 * @route   GET /api/user?id=****&username=****
 * @access  Private/Admin
 */
const getUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.query.id);
    const username = req.query.username as string | undefined;
    if (!userId && !username) {
        res.status(StatusCodes.BAD_REQUEST);
        throw Error("invalid userId");
    }

    const user = await db.query.UserTable.findFirst({
        columns: {
            password: false
        },
        where: and(
            userId ? eq(UserTable.id, userId) : undefined,
            username ? eq(UserTable.username, username) : undefined
        )
    });

    if (user) {
        res.json(user);
    } else {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error('User not found');
    }
});


export {
    getUserList,
    deleteUser,
    getUser
};
