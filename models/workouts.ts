import mongoose from "mongoose";
import WorkoutSchema from "./schema/workouts.ts";
import type { IWorkoutDocument, IWorkoutModel } from "../types/types.ts";

/**
 * Workout model for the Workout collection
 * @description Creates a mongoose model for the Workout collection using the Workout schema.
 * The model is defined with two generic parameters: IWorkoutDocument and IWorkoutModel.
 * IWorkoutDocument defines the document instance methods and properties.
 * IWorkoutModel defines the static model methods.
 * 
 * @property {string} userId - The ID of the user who created the workout (required)
 * @property {string} name - The name of the workout (required)
 * @property {string} description - The description of the workout
 * @property {string} date - The date the workout was performed (required)
 * @property {Array<{exercise: string, sets: number, reps: number, weight: number}>} exercises - The exercises in the workout
 * 
 * @method findWorkoutsByUser - Static method to find workouts for a specific user
 * @method createWorkout - Static method to create a new workout
 * @method updateWorkout - Static method to update an existing workout
 * @method deleteWorkout - Static method to delete a workout
 */
export const Workout = mongoose.model<IWorkoutDocument, IWorkoutModel>("Workout", WorkoutSchema);

export default Workout;
