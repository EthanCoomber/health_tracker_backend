import mongoose from "mongoose";


/**
 * A type representing an error object
 * @property {number} status - The HTTP status code
 * @property {string} message - The error message
 * @property {string[]} errors - An array of error messages
 */
export interface IError {
  status: number;
  message: string;
  errors: string[];
}

/**
 * A type representing a user object
 * @property {string} _id - The unique identifier of the user
 * @property {string} username - The username of the user
 * @property {string} email - The email of the user
 * @property {string} password - The hashed password of the user
 */
export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
}

/**
 * A type representing a user document schema in the users collection
 * @extends {Omit<mongoose.Document, "_id">}
 * @extends {Omit<IUser, "_id">}
 * @property {mongoose.Types.ObjectId} _id - The unique identifier of the user document
 * @method findUserByEmail - A static method that finds a user by email
 * @method createUser - A static method that creates a user
 */
export interface IUserDocument
  extends Omit<mongoose.Document, "_id">,
    Omit<IUser, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing a model for the users collection
 * @extends {mongoose.Model<IUserDocument>}
 * @method findUserByEmail - A static method that finds a user by email
 * @param {string} email - The email of the user to find
 * @returns {Promise<IUserDocument | null>} The found user document or null
 * @method createUser - A static method that creates a user
 * @param {Object} userData - The user data for creating a new user
 * @param {string} userData.username - The username for the new user
 * @param {string} userData.email - The email for the new user
 * @param {string} userData.password - The hashed password for the new user
 * @returns {Promise<IUserDocument>} The newly created user document
 */
export interface IUserModel extends mongoose.Model<IUserDocument> {
  findUserByEmail(email: string): Promise<IUserDocument | null>;
  createUser(userData: { username: string; email: string; password: string }): Promise<IUserDocument>;
}

/**
 * A type representing a workout object
 * @property {string} _id - The unique identifier of the workout
 * @property {string} userId - The ID of the user who created the workout
 * @property {string} name - The name of the workout
 * @property {string} description - The description of the workout
 * @property {string} date - The date the workout was performed
 * @property {Array<{exercise: string, sets: number, reps: number, weight: number}>} exercises - The exercises in the workout
 */
export interface IWorkout {
  _id?: string;
  userId: string;
  name: string;
  description: string;
  date: string;
  exercises: Array<{
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
  }>;
}

/**
 * A type representing a workout document schema in the workouts collection
 * @extends {Omit<mongoose.Document, "_id">}
 * @extends {Omit<IWorkout, "_id">}
 * @property {mongoose.Types.ObjectId} _id - The unique identifier of the workout document
 */
export interface IWorkoutDocument
  extends Omit<mongoose.Document, "_id">,
    Omit<IWorkout, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing a model for the workouts collection
 * @extends {mongoose.Model<IWorkoutDocument>}
 * @method findWorkoutsByUser - A static method that finds workouts for a specific user
 * @param {string} userId - The ID of the user whose workouts to find
 * @returns {Promise<IWorkout[]>} Array of workouts for the specified user
 * @method createWorkout - A static method that creates a workout
 * @param {IWorkout} workoutData - The workout data to save
 * @returns {Promise<IWorkout>} The created workout
 * @method updateWorkout - A static method that updates a workout
 * @param {string} workoutId - The ID of the workout to update
 * @param {Partial<IWorkout>} workoutData - The workout data to update
 * @returns {Promise<IWorkout>} The updated workout
 * @method deleteWorkout - A static method that deletes a workout
 * @param {string} workoutId - The ID of the workout to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */
export interface IWorkoutModel extends mongoose.Model<IWorkoutDocument> {
  findWorkoutsByUser(userId: string): Promise<IWorkoutDocument[]>;
  createWorkout(workoutData: IWorkout): Promise<IWorkoutDocument>;
  updateWorkout(workoutId: string, workoutData: Partial<IWorkout>): Promise<IWorkoutDocument | null>;
  deleteWorkout(workoutId: string): Promise<boolean>;
}

/**
 * A type representing a meal object
 * @property {string} _id - The unique identifier of the meal
 * @property {string} userId - The ID of the user who created the meal
 * @property {string} name - The name of the meal
 * @property {string} description - The description of the meal
 * @property {string} date - The date the meal was consumed
 * @property {Array<{food: string, quantity: number, calories: number}>} foods - The foods in the meal
 */
export interface IMeal {
  _id?: string;
  userId: string;
  name: string;
  description: string;
  date: string;
  foods: Array<{food: string, quantity: number, calories: number}>;
}

/**
 * A type representing a meal document schema in the meals collection
 * @extends {Omit<mongoose.Document, "_id">}
 * @extends {Omit<IMeal, "_id">}
 * @property {mongoose.Types.ObjectId} _id - The unique identifier of the meal document
 */
export interface IMealDocument
  extends Omit<mongoose.Document, "_id">,
    Omit<IMeal, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing a model for the meals collection
 * @extends {mongoose.Model<IMealDocument>}
 * @method findMealsByUser - A static method that finds meals for a specific user
 * @param {string} userId - The ID of the user whose meals to find
 * @returns {Promise<IMealDocument[]>} Array of meals for the specified user
 * @method createMeal - A static method that creates a meal
 * @param {IMeal} mealData - The meal data to save
 * @returns {Promise<IMealDocument>} The created meal
 * @method updateMeal - A static method that updates a meal
 * @param {string} mealId - The ID of the meal to update
 * @param {Partial<IMeal>} mealData - The meal data to update
 * @returns {Promise<IMealDocument | null>} The updated meal or null if not found
 * @method deleteMeal - A static method that deletes a meal
 * @param {string} mealId - The ID of the meal to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */
export interface IMealModel extends mongoose.Model<IMealDocument> {
  findMealsByUser(userId: string): Promise<IMealDocument[]>;
  createMeal(mealData: IMeal): Promise<IMealDocument>;
  updateMeal(mealId: string, mealData: Partial<IMeal>): Promise<IMealDocument | null>;
  deleteMeal(mealId: string): Promise<boolean>;
}
