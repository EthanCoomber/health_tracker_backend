import { openai } from "../config/openai";

/**
 * @fileoverview Service module for handling workout-related operations
 * @module services/workoutService
 */

import Workout from "../models/workouts";
import { IWorkout } from "../types/types";

/**
 * Fetches all workouts for a specific user
 * @async
 * @function getUserWorkouts
 * @param {string} userId - The ID of the user whose workouts to fetch
 * @returns {Promise<Array<IWorkout>>} Array of workout objects
 * @description 
 * 1. Retrieves all workouts from the database for the specified user
 * 2. Returns array of workouts
 */
export const getUserWorkouts = async (userId: string) => {
  const workouts = await Workout.findWorkoutsByUser(userId);
  return workouts;
};

/**
 * Creates a new workout entry
 * @async
 * @function createWorkout
 * @param {IWorkout} workoutData - The workout data to save
 * @returns {Promise<IWorkout>} The created workout object
 * @description 
 * 1. Creates a new workout in the database
 * 2. Returns the created workout
 */
export const createWorkout = async (workoutData: IWorkout) => {
  const workout = await Workout.createWorkout(workoutData);
  return workout;
};

/**
 * Updates an existing workout
 * @async
 * @function updateWorkout
 * @param {string} workoutId - The ID of the workout to update
 * @param {Partial<IWorkout>} workoutData - The workout data to update
 * @returns {Promise<IWorkout>} The updated workout object
 * @description 
 * 1. Updates the specified workout in the database
 * 2. Returns the updated workout
 */
export const updateWorkout = async (workoutId: string, workoutData: Partial<IWorkout>) => {
  const workout = await Workout.updateWorkout(workoutId, workoutData);
  return workout;
};

/**
 * Deletes a workout
 * @async
 * @function deleteWorkout
 * @param {string} workoutId - The ID of the workout to delete
 * @returns {Promise<boolean>} True if deletion was successful
 * @description 
 * 1. Deletes the specified workout from the database
 * 2. Returns true if successful
 */
export const deleteWorkout = async (workoutId: string) => {
  const result = await Workout.deleteWorkout(workoutId);
  return result;
};

/**
 * Calculates statistics for a workout
 * @async
 * @function calculateWorkoutStats
 * @param {string} workoutId - The ID of the workout to analyze
 * @returns {Promise<Object|null>} Workout statistics or null if workout not found
 * @description 
 * 1. Finds the workout by ID
 * 2. Calculates various statistics like total duration, calories burned, etc.
 * 3. Returns the calculated statistics
 */
export const calculateWorkoutStats = async (workoutId: string) => {
  console.log('workoutId in service: ', workoutId);
  const workout = await Workout.findById(workoutId);
  console.log('workout in service: ', workout);
  if (!workout) return null;

  // Extract workout data
  const { exercises, date } = workout;
  
  // Calculate total statistics
  const totalSets = exercises.reduce((total, exercise) => total + exercise.sets, 0);
  const totalReps = exercises.reduce((total, exercise) => total + exercise.sets * exercise.reps, 0);
  const totalWeight = exercises.reduce((total, exercise) => 
    total + (exercise.weight || 0) * exercise.sets * exercise.reps, 0);
  
  // Use AI to estimate calories burned based on exercise type and duration
  const exerciseDescription = exercises.map(e => 
    `${e.exercise}: ${e.sets} sets of ${e.reps} reps at ${e.weight || 0}kg`).join(', ');
  
  const prompt = `
    You are a fitness expert AI. Calculate estimated calories burned for this workout:
    Exercises: ${exerciseDescription}
    User stats: Average adult
    
    Please provide only a numeric estimate of total calories burned.
  `;

  let caloriesBurned = 0; // Default calculation
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });
    
    const aiResponse = response.choices[0].message.content;
    const extractedCalories = parseInt(aiResponse?.match(/\d+/)?.[0] || '0');
    
    if (extractedCalories > 0) {
      caloriesBurned = extractedCalories;
    }
    
    console.log('AI estimated calories: ', caloriesBurned);
  } catch (error) {
    console.error('Error getting AI calorie estimate:', error);
    // Fall back to simple calculation if AI fails
  }
  
  // Calculate workout intensity (simplified)
  let intensity = "Low";
  if (totalWeight > 5000) intensity = "High";
  else if (totalWeight > 2000) intensity = "Medium";
  
  const stats = {
    workoutId,
    date,
    totalExercises: exercises.length,
    totalSets,
    totalReps,
    totalWeight,
    caloriesBurned,
    intensity,
    averageWeightPerExercise: exercises.length > 0 ? 
      Math.round(totalWeight / exercises.length) : 0
  };

  console.log('stats calculated: ', stats);

  return stats;
};


