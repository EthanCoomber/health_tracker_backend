import mongoose from "mongoose";
import type { IWorkoutDocument, IWorkoutModel, IWorkout } from "../../types/types.ts";

/**
 * The schema for a document in the Workouts collection.
 * 
 * @description The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IWorkoutDocument and IWorkoutModel.
 * IWorkoutDocument is used to define the instance methods of the Workout document.
 * IWorkoutModel is used to define the static methods of the Workout model.
 * 
 * @property {string} userId - The ID of the user who created the workout (required)
 * @property {string} name - The name of the workout (required)
 * @property {string} description - The description of the workout
 * @property {string} date - The date the workout was performed (required)
 * @property {Array<{exercise: string, sets: number, reps: number, weight: number}>} exercises - The exercises in the workout
 */
const WorkoutSchema = new mongoose.Schema<IWorkoutDocument, IWorkoutModel>(
  {
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    date: {
      type: String,
      required: true
    },
    exercises: [
      {
        exercise: String,
        sets: Number,
        reps: Number,
        weight: Number
      }
    ]
  },
  { collection: "Workout" }
);

/**
 * Find workouts by user
 * @method findWorkoutsByUser
 * @static
 * @async
 * @param {string} userId - The ID of the user whose workouts to find
 * @returns {Promise<IWorkoutDocument[]>} A promise that resolves to an array of workout documents
 * @description Queries the database for workouts created by the specified user
 */
WorkoutSchema.statics.findWorkoutsByUser = async function(userId: string): Promise<IWorkoutDocument[]> {
  return await this.find({ userId: userId });
};

/**
 * Create a new workout
 * @method createWorkout
 * @static
 * @async
 * @param {Object} workoutData - The workout data for creating a new workout
 * @returns {Promise<IWorkoutDocument>} A promise that resolves to the newly created workout document
 * @description Creates a new workout document in the database with the specified data
 */
WorkoutSchema.statics.createWorkout = async function(workoutData: IWorkout): Promise<IWorkoutDocument> {
  const workout = await this.create(workoutData);
  return workout as unknown as IWorkoutDocument;
};

/**
 * Update an existing workout
 * @method updateWorkout
 * @static
 * @async
 * @param {string} workoutId - The ID of the workout to update
 * @param {Object} updateData - The data to update the workout with
 * @returns {Promise<IWorkoutDocument | null>} A promise that resolves to the updated workout document, or null if not found
 * @description Updates an existing workout document in the database with the specified data
 */
WorkoutSchema.statics.updateWorkout = async function(workoutId: string, updateData: Partial<IWorkout>): Promise<IWorkoutDocument | null> {
  return await this.findByIdAndUpdate(workoutId, updateData, { new: true });
};

/**
 * Delete a workout
 * @method deleteWorkout
 * @static
 * @async
 * @param {string} workoutId - The ID of the workout to delete
 * @returns {Promise<boolean>} A promise that resolves to true if the workout was deleted, false otherwise
 * @description Deletes a workout document from the database
 */
WorkoutSchema.statics.deleteWorkout = async function(workoutId: string): Promise<boolean> {
  const result = await this.findByIdAndDelete(workoutId);
  return result !== null;
};

/**
 * Transform method for JSON serialization
 * @method toJSON
 * @param {Document} doc - The mongoose document being converted
 * @param {Object} ret - The plain object representation that will be returned
 * @returns {Object} The transformed object with string _id and removed __v field
 * @description Customizes how the document is transformed when converted to JSON:
 *              - Converts ObjectId to string for _id
 *              - Removes the version key (__v)
 */
WorkoutSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export default WorkoutSchema;
