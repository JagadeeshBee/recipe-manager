import axios from "axios";
import Recipe from "../models/Recipe.js";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";

// Search recipes by name/keyword
export const searchRecipes = async (req, res) => {
  const query = req.query.query;
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
      params: {
        query,
        number: 10,
        apiKey: SPOONACULAR_API_KEY,
      },
    });
    res.json(response.data.results);
  } catch (error) {
    console.error("Error searching recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

// Get a specific recipe with all the details
export const getRecipeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/${id}/information`, {
      params: { apiKey: SPOONACULAR_API_KEY },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recipe details:", error.message);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
};

//  Saving recipe to MongoDB-compass
export const saveRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error saving recipe:", error.message);
    res.status(500).json({ error: "Failed to save recipe" });
  }
};

// Get  saved recipes from MongoDB
export const getSavedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    console.error("Error retrieving recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch saved recipes" });
  }
};
