import express from "express";
import { loginWithCredentials, signup } from "../controllers/auth-controller.js";

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(loginWithCredentials);

export default router;