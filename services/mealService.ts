import { openai } from "../config/openai.ts";

/**
 * @fileoverview Service module for handling meal-related operations
 * @module services/mealService
 */

import Meal from "../models/meals.ts";
import type { IMeal } from "../types/types.ts";

/**
 * Fetches all meals for a specific user
 * @async
 * @function getUserMeals
 * @param {string} userId - The ID of the user whose meals to fetch
 * @returns {Promise<Array<IMeal>>} Array of meal objects
 * @description 
 * 1. Retrieves all meals from the database for the specified user
 * 2. Returns array of meals
 */
export const getUserMeals = async (userId: string) => {
  const meals = await Meal.findMealsByUser(userId);
  return meals;
};

/**
 * Creates a new meal entry
 * @async
 * @function createMeal
 * @param {IMeal} mealData - The meal data to save
 * @returns {Promise<IMeal>} The created meal object
 * @description 
 * 1. Creates a new meal in the database
 * 2. Returns the created meal
 */
export const createMeal = async (mealData: IMeal) => {
  const meal = await Meal.createMeal(mealData);
  return meal;
};

/**
 * Updates an existing meal
 * @async
 * @function updateMeal
 * @param {string} mealId - The ID of the meal to update
 * @param {Partial<IMeal>} mealData - The meal data to update
 * @returns {Promise<IMeal>} The updated meal object
 * @description 
 * 1. Updates the specified meal in the database
 * 2. Returns the updated meal
 */
export const updateMeal = async (mealId: string, mealData: Partial<IMeal>) => {
  const meal = await Meal.updateMeal(mealId, mealData);
  return meal;
};

/**
 * Deletes a meal
 * @async
 * @function deleteMeal
 * @param {string} mealId - The ID of the meal to delete
 * @returns {Promise<boolean>} True if deletion was successful
 * @description 
 * 1. Deletes the specified meal from the database
 * 2. Returns true if successful
 */
export const deleteMeal = async (mealId: string) => {
  const result = await Meal.deleteMeal(mealId);
  return result;
};


/**
 * Calculates statistics for a meal
 * @async
 * @function calculateMealStats
 * @param {string} mealId - The ID of the meal to analyze
 * @returns {Promise<Object|null>} Meal statistics or null if meal not found
 * @description 
 * 1. Finds the meal by ID
 * 2. Calculates various statistics like total calories, protein, carbs, fat, etc.
 * 3. Returns the calculated statistics
 */
export const calculateMealStats = async (mealId: string) => {
  const meal = await Meal.findById(mealId);
  if (!meal) return null;

  // Extract meal data
  const { foods, date } = meal;

  // Calculate total statistics
  const totalCalories = foods.reduce((total, food) => 
    total + (food.calories || 0), 0);

  // Use AI to estimate calories burned based on meal type and ingredients
  const mealDescription = foods.map(f => 
    `${f.food}: ${f.quantity}`).join(', ');

  const prompt = `
    You are a nutritionist AI. Calculate estimated calories for this meal:
    Foods: ${mealDescription}
    User stats: Average adult
    
    Please provide only a numeric estimate of total calories.
  `;

  let calories = 0; // Default calculation
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });
    
    const aiResponse = response.choices[0].message.content;
    const extractedCalories = parseInt(aiResponse?.match(/\d+/)?.[0] || '0');
    
    if (extractedCalories > 0) {
      calories = extractedCalories;
    }
    
    console.log('AI estimated calories: ', calories);
  } catch (error) {
    console.error('Error getting AI calorie estimate:', error);
    // Fall back to simple calculation if AI fails
  }
  
  const stats = {
    mealId,
    date,
    totalCalories,
    calories
  };

  console.log('stats calculated: ', stats);

  return stats;
};



