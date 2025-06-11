import mongoose from "mongoose";
import { IMealDocument, IMealModel, IMeal } from "../../types/types";

/**
 * The schema for a document in the Meals collection.
 * 
 * @description The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IMealDocument and IMealModel.
 * IMealDocument is used to define the instance methods of the Meal document.
 * IMealModel is used to define the static methods of the Meal model.
 * 
 * @property {string} userId - The ID of the user who created the meal (required)
 * @property {string} name - The name of the meal (required)
 * @property {string} description - The description of the meal
 * @property {string} date - The date the meal was consumed (required)
 * @property {Array<{food: string, quantity: number, calories: number}>} foods - The foods in the meal
 */
const MealSchema = new mongoose.Schema<IMealDocument, IMealModel>(
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
    foods: [
      {
        food: String,
        quantity: Number,
        calories: Number
      }
    ]
  },
  { collection: "Meal" }
);

/**
 * Find meals by user
 * @method findMealsByUser
 * @static
 * @async
 * @param {string} userId - The ID of the user whose meals to find
 * @returns {Promise<IMeal[]>} A promise that resolves to an array of meal documents
 * @description Queries the database for meals associated with the specified user
 */
MealSchema.statics.findMealsByUser = async function(userId: string): Promise<IMealDocument[]> {
  return await this.find({ userId: userId });
};

/**
 * Create a new meal
 * @method createMeal
 * @static
 * @async
 * @param {IMeal} mealData - The meal data for creating a new meal
 * @returns {Promise<IMeal>} A promise that resolves to the newly created meal document
 * @description Creates a new meal document in the database with the specified data
 */
MealSchema.statics.createMeal = async function(mealData: IMeal): Promise<IMealDocument> {
  const meal = await this.create(mealData);
  return meal;
};

/**
 * Update an existing meal
 * @method updateMeal
 * @static
 * @async
 * @param {string} mealId - The ID of the meal to update
 * @param {Partial<IMeal>} mealData - The meal data to update
 * @returns {Promise<IMeal>} A promise that resolves to the updated meal document
 * @description Updates an existing meal document in the database with the specified data
 */
MealSchema.statics.updateMeal = async function(mealId: string, mealData: Partial<IMeal>): Promise<IMealDocument | null> {
  return await this.findByIdAndUpdate(mealId, mealData, { new: true });
};

/**
 * Delete a meal
 * @method deleteMeal
 * @static
 * @async
 * @param {string} mealId - The ID of the meal to delete
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
 * @description Deletes a meal document from the database
 */
MealSchema.statics.deleteMeal = async function(mealId: string): Promise<boolean> {
  const result = await this.findByIdAndDelete(mealId);
  return !!result;
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
MealSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export default MealSchema;
