import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

const app = express();

//  Middleware usage
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//  Routes for recipe
app.use("/api/recipes", recipeRoutes);

// mongoose for MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("  MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Health check as per best practice
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running smoothly!" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
