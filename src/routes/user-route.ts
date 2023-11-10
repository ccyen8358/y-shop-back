import express from 'express';
import {
    deleteUser,
    getUser,
    getUserList
} from '../controllers/user-controller.js';
import { isLoggedIn, isAdmin } from '../middleware/auth-middleware.js';

const router = express.Router();

router.route('/list').get(isLoggedIn, isAdmin, getUserList);
router.route('/').get(isLoggedIn, isAdmin, getUser);
router.route('/:id').delete(isLoggedIn, isAdmin, deleteUser);
// router
//   .route('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);
// router
//   .route('/:id')
//   .delete(protect, admin, deleteUser)
//   .get(protect, admin, getUserById)
//   .put(protect, admin, updateUser);

export default router;
