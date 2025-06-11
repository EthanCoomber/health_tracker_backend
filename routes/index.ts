/**
 * Express router configuration module
 * @module routes/index
 * @description Defines all API routes and their handlers
 */

import { Router } from "express";
import userController from "../controllers/userController";

const router = Router();

// User routes
/**
 * User login
 * @route POST /user/login
 * @description Authenticates a user with credentials
 * @param {object} req.body - The user credentials (email/username and password)
 * @returns {object} 200 - User details and authentication token
 * @returns {Error} 401 - If credentials are invalid
 * @returns {Error} 500 - If an error occurs during authentication
 */
router.post('/user/login', userController.login);

/**
 * User signup
 * @route POST /user/signup
 * @description Registers a new user
 * @param {object} req.body - The user registration details
 * @returns {object} 201 - Newly created user details and authentication token
 * @returns {Error} 400 - If registration data is invalid
 * @returns {Error} 500 - If an error occurs during registration
 */
router.post('/user/signup', userController.signup);

export default router;