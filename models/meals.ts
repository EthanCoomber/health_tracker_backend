import mongoose from "mongoose";
import MealSchema from "./schema/meals";
import { IMealDocument, IMealModel } from "../types/types";

/**
 * Meal model for the Meal collection
 * @description Creates a mongoose model for the Meal collection using the Meal schema.
 * The model is defined with two generic parameters: IMealDocument and IMealModel.
 * IMealDocument defines the document instance methods and properties.
 * IMealModel defines the static model methods.
 * 
 * @property {string} userId - The ID of the user who created the meal (required)
 * @property {string} name - The name of the meal (required)
 * @property {string} description - The description of the meal
 * @property {string} date - The date the meal was consumed (required)
 * @property {Array<{food: string, quantity: number, calories: number}>} foods - The foods in the meal
 * 
 * @method findMealsByUser - Static method to find meals for a specific user
 * @method createMeal - Static method to create a new meal
 * @method updateMeal - Static method to update an existing meal
 * @method deleteMeal - Static method to delete a meal
 */
export const Meal = mongoose.model<IMealDocument, IMealModel>("Meal", MealSchema);

export default Meal;
