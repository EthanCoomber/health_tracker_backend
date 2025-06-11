import type { Request, Response } from "express";
import * as workoutService from "../services/workoutService.ts";

/**
 * Controller to handle workout creation
 * @param {Request} req - Express request object containing workout details in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the workout is created
 * @description Creates a new workout using the workout service and returns the created workout.
 *              If workout data is invalid, returns a 400 status code.
 *              If an error occurs, returns a 500 status code with error details.
 */
const createWorkout = async (req: Request, res: Response) => {
  try {
    const result = await workoutService.createWorkout(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("validation")) {
      res.status(400).json({ message: "Invalid workout data", error: err.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
};

/**
 * Controller to handle retrieving all workouts
 * @param {Request} req - Express request object containing user ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when workouts are retrieved
 * @description Retrieves all workouts for a user using the workout service.
 *              If an error occurs, returns a 500 status code with error details.
 */
const getAllWorkouts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const workouts = await workoutService.getUserWorkouts(userId);
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Workout controller module
 * @module workoutController
 * @exports {Object} Controller methods for handling workout-related requests
 * @property {Function} createWorkout - Method to create a new workout
 * @property {Function} getAllWorkouts - Method to retrieve all workouts for a user
 */
export default {
  createWorkout,
  getAllWorkouts,
};
