import { LoginUser } from "../controllers/user-controller.ts";

declare module "express-serve-static-core" {
    interface Request {
        user?: LoginUser;
    }
}

export interface ApiResponse<T = any> {
    message: string;
    data?: T;
}
