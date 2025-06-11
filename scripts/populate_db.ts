// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fitness_tracker)

import mongoose from "mongoose";
import UserSchema from "../models/schema/user";
import WorkoutSchema from "../models/schema/workouts";
import MealSchema from "../models/schema/meals";
import { IUserDocument, IWorkoutDocument, IMealDocument } from "../types/types";

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// Check if user has passed a valid MongoDB URL
if (!userArgs[0].startsWith("mongodb")) {
  console.log(
    "ERROR: You need to specify a valid MongoDB URL as the first argument"
  );
  process.exit(1);
}

// Connect to the MongoDB instance with the URL passed as argument
const mongoDB = userArgs[0];

mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

/**
 * Creates a new user in the database
 * @param username The username for the new user
 * @param email The email for the new user
 * @param password The hashed password for the new user
 * @returns A promise that resolves to the created user document
 */
async function userCreate(
  username: string,
  email: string,
  password: string
): Promise<IUserDocument> {
  const User = mongoose.model<IUserDocument>("User", UserSchema);
  return await User.create({ username, email, password });
}

/**
 * Creates a new workout in the database
 * @param userId The ID of the user who created the workout
 * @param name The name of the workout
 * @param description The description of the workout
 * @param date The date the workout was performed
 * @param exercises The exercises in the workout
 * @returns A promise that resolves to the created workout document
 */
async function workoutCreate(
  userId: string,
  name: string,
  description: string,
  date: string,
  exercises: Array<{ exercise: string; sets: number; reps: number; weight: number }>
): Promise<IWorkoutDocument> {
  const Workout = mongoose.model<IWorkoutDocument>("Workout", WorkoutSchema);
  return await Workout.create({
    userId,
    name,
    description,
    date,
    exercises
  });
}

/**
 * Creates a new meal in the database
 * @param userId The ID of the user who created the meal
 * @param name The name of the meal
 * @param description The description of the meal
 * @param date The date the meal was consumed
 * @param calories The number of calories in the meal
 * @returns A promise that resolves to the created meal document
 */
async function mealCreate(
  userId: string,
  name: string,
  description: string,
  date: string,
  calories: number
): Promise<IMealDocument> {
  const Meal = mongoose.model<IMealDocument>("Meal", MealSchema);
  return await Meal.create({
    userId,
    name,
    description,
    date,
    calories
  });
}

/**
 * Populates the database with sample data
 */
const populate = async () => {
  try {
    // Create sample users
    const user1 = await userCreate(
      "john_doe",
      "john@example.com",
      "hashed_password_1"
    );
    const user2 = await userCreate(
      "jane_smith",
      "jane@example.com",
      "hashed_password_2"
    );

    // Create sample workouts
    await workoutCreate(
      user1._id.toString(),
      "Morning Run",
      "5km run in the park",
      "2024-03-20",
      [{ exercise: "Running", sets: 1, reps: 1, weight: 0 }]
    );
    await workoutCreate(
      user2._id.toString(),
      "Upper Body",
      "Focus on chest and arms",
      "2024-03-19",
      [
        { exercise: "Bench Press", sets: 3, reps: 10, weight: 135 },
        { exercise: "Bicep Curls", sets: 3, reps: 12, weight: 30 }
      ]
    );

    // Create sample meals
    await mealCreate(
      user1._id.toString(),
      "Breakfast",
      "Oatmeal with fruits",
      "2024-03-20",
      350
    );
    await mealCreate(
      user2._id.toString(),
      "Lunch",
      "Grilled chicken salad",
      "2024-03-19",
      450
    );

    console.log("Database populated successfully");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    db.close();
  }
};

populate();
console.log("Processing...");
