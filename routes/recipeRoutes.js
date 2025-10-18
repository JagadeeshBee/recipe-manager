import express from "express";
import Recipe from "../models/Recipe.js";
import axios from "axios";

const router = express.Router();

//SPOONACULAR API ROUTES

// searching recipes from our spoonacular API GET/api
router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      error: "Missing ?query= parameter",
    });
  }

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      {
        params: {
          query,
          number: 10,
          addRecipeInformation: true,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    res.json({
      success: true,
      count: response.data.results.length,
      data: response.data.results,
    });
  } catch (err) {
    console.error("Spoonacular API Error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch from Spoonacular API",
      message: err.message,
    });
  }
});


 // Get detailed Spoonacular recipe info by ID
router.get("/spoonacular/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: { apiKey: process.env.SPOONACULAR_API_KEY },
      }
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (err) {
    console.error("Error fetching recipe details:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recipe details",
    });
  }
});

//Local MongoDb route

// Get all saved recipes 
router.get("/", async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { summary: { $regex: search, $options: "i" } },
        ],
      };
    }

    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (err) {
    console.error("Error fetching recipes:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recipes",
    });
  }
});

// Get a specific recipe using id of mongodb 
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.json({
      success: true,
      data: recipe,
    });
  } catch (err) {
    console.error("Error fetching recipe:", err.message);
    res.status(500).json({
      success: false,
      error: "Error fetching recipe",
    });
  }
});

//creates a new recipes with a source link in mongodb 
router.post("/", async (req, res) => {
  try {
    const { title, image, sourceUrl, summary, ingredients, instructions } =
      req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    const recipe = new Recipe({
      title,
      image: image || "",
      sourceUrl: sourceUrl || "",
      summary: summary || "",
      ingredients: ingredients || [],
      instructions: instructions || "",
    });

    await recipe.save();

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (err) {
    console.error("Error creating recipe:", err.message);
    res.status(400).json({
      success: false,
      error: "Failed to create recipe",
      message: err.message,
    });
  }
});

//update recipe --patch using ID 
router.patch("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.json({
      success: true,
      message: "Recipe updated successfully",
      data: recipe,
    });
  } catch (err) {
    console.error("Error updating recipe:", err.message);
    res.status(400).json({
      success: false,
      error: "Failed to update recipe",
      message: err.message,
    });
  }
});
//delete a recipe
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.json({
      success: true,
      message: "Recipe deleted successfully",
      data: deleted,
    });
  } catch (err) {
    console.error("Error deleting recipe:", err.message);
    res.status(400).json({
      success: false,
      error: "Failed to delete recipe",
      message: err.message,
    });
  }
});

// get summary or stats on 
router.get("/stats/summary", async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    const recentRecipes = await Recipe.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    res.json({
      success: true,
      data: {
        totalRecipes,
        recentRecipes,
        timestamp: new Date(),
      },
    });
  } catch (err) {
    console.error("Error fetching stats:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
});

export default router;
