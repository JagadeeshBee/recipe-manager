import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  sourceUrl: { type: String },
  summary: { type: String },
  ingredients: [
    {
      name: String,
      amount: String,
    },
  ],
  instructions: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Recipe", recipeSchema);
