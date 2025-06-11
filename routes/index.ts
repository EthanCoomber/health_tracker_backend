/**
 * Express router configuration module
 * @module routes/index
 * @description Defines all API routes and their handlers
 */

import { Router } from "express";
import userController from "../controllers/userController.ts";
import workoutController from "../controllers/workoutController.ts";
import mealController from "../controllers/mealController.ts";

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

// Workout routes
/**
 * Create workout
 * @route POST /workout
 * @description Creates a new workout record
 * @param {object} req.body - The workout details
 * @returns {object} 201 - Newly created workout details
 * @returns {Error} 400 - If workout data is invalid
 * @returns {Error} 500 - If an error occurs during creation
 */
router.post('/workout', workoutController.createWorkout);

/**
 * Get all workouts
 * @route GET /workout
 * @description Retrieves all workouts for the authenticated user
 * @returns {object} 200 - Array of workout records
 * @returns {Error} 500 - If an error occurs during retrieval
 */
router.get('/workout', workoutController.getAllWorkouts);

// Meal routes
/**
 * Create meal
 * @route POST /meal
 * @description Creates a new meal record
 * @param {object} req.body - The meal details
 * @returns {object} 201 - Newly created meal details
 * @returns {Error} 400 - If meal data is invalid
 * @returns {Error} 500 - If an error occurs during creation
 */
router.post('/meal', mealController.createMeal);

/**
 * Get all meals
 * @route GET /meal
 * @description Retrieves all meals for the authenticated user
 * @returns {object} 200 - Array of meal records
 * @returns {Error} 500 - If an error occurs during retrieval
 */
router.get('/meal', mealController.getAllMeals);

export default router;