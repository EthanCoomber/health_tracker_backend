import type { Request, Response } from "express";
import * as mealService from "../services/mealService.ts";

/**
 * Controller to handle meal creation
 * @param {Request} req - Express request object containing meal details in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the meal is created
 * @description Creates a new meal using the meal service and returns the created meal details.
 *              If meal data is invalid, returns a 400 status code.
 *              If an error occurs, returns a 500 status code with error details.
 */
const createMeal = async (req: Request, res: Response) => {
  try {
    const result = await mealService.createMeal(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("validation")) {
      res.status(400).json({ message: "Invalid meal data", error: err.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
};

/**
 * Controller to handle retrieving all meals
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when meals are retrieved
 * @description Retrieves all meals for the authenticated user using the meal service.
 *              If an error occurs, returns a 500 status code with error details.
 */
const getAllMeals = async (req: Request, res: Response) => {
  try {
    const userId = req.params.useId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const meals = await mealService.getUserMeals(userId);
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Controller to handle meal updates
 * @param {Request} req - Express request object containing meal ID and update data
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the meal is updated
 * @description Updates an existing meal using the meal service.
 *              If meal data is invalid, returns a 400 status code.
 *              If meal is not found, returns a 404 status code.
 *              If an error occurs, returns a 500 status code with error details.
 */
const updateMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const result = await mealService.updateMeal(mealId, req.body);
    if (!result) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("validation")) {
      res.status(400).json({ message: "Invalid meal data", error: err.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
};

/**
 * Controller to handle meal deletion
 * @param {Request} req - Express request object containing meal ID
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the meal is deleted
 * @description Deletes a meal using the meal service.
 *              If meal is not found, returns a 404 status code.
 *              If an error occurs, returns a 500 status code with error details.
 */
const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const result = await mealService.deleteMeal(mealId);
    if (!result) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.json({ message: "Meal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Controller to handle meal statistics calculation
 * @param {Request} req - Express request object containing meal ID
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when meal stats are calculated
 * @description Calculates statistics for a meal using the meal service.
 *              If meal is not found, returns a 404 status code.
 *              If an error occurs, returns a 500 status code with error details.
 */
const getMealStats = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const stats = await mealService.calculateMealStats(mealId);
    if (!stats) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * Meal controller module
 * @module mealController
 * @exports {Object} Controller methods for handling meal-related requests
 */
export default {
  createMeal,
  getAllMeals,
  updateMeal,
  deleteMeal,
  getMealStats,
};
