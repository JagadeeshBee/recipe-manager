import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const API_BASE = "http://localhost:3000/api";

//  Hero Search 
function HeroSearch({ query, setQuery, onSearch, loading }) {
  return (
    <section className="hero-search">
      <div className="search-hero-container">
        <h2>Find Your Perfect Recipe</h2>
        <p>Search from over 500,000 recipes</p>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Try 'pasta carbonara', 'chicken curry', or 'chocolate cake'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
            className="hero-search-input"
          />
          <button onClick={onSearch} disabled={loading} className="hero-search-btn">
            {loading ? "Searching..." : "🔍 Search Recipes"}
          </button>
        </div>
      </div>
    </section>
  );
}

// Stats Component
function StatsBar({ stats }) {
  return (
    <section className="stats-bar">
      <div className="stat-item">
        <span className="stat-icon"></span>
        <div>
          <p className="stat-label">Total Recipes</p>
          <p className="stat-value">{stats.totalRecipes || 0}</p>
        </div>
      </div>
      <div className="stat-item">
        <span className="stat-icon">⭐</span>
        <div>
          <p className="stat-label">Added Today</p>
          <p className="stat-value">{stats.recentRecipes || 0}</p>
        </div>
      </div>
      <div className="stat-item">
        <span className="stat-icon">🔍</span>
        <div>
          <p className="stat-label">Your Collections</p>
          <p className="stat-value">{stats.totalRecipes || 0}</p>
        </div>
      </div>
    </section>
  );
}

//  Recipe Card Component
function RecipeCard({ recipe, onSelect, onDelete, isSaved }) {
  return (
    <div className="recipe-card">
      <div className="recipe-image-container">
        <img
          src={recipe.image || "https://via.placeholder.com/250x200?text=No+Image"}
          alt={recipe.title}
        />
        {isSaved && <span className="saved-badge">💾 Saved</span>}
      </div>
      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        <p className="recipe-summary">
          {recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '').substring(0, 100) + "..." : "No description"}
        </p>
      </div>
      <div className="recipe-actions">
        <button className="btn-view" onClick={() => onSelect(recipe)}>
          👁️ View
        </button>
        {isSaved && (
          <button className="btn-delete" onClick={() => onDelete(recipe._id)}>
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
}

// Recipe Detail Modal
function RecipeDetailModal({ recipe, onClose, onSave, isSaved }) {
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipe.title,
          image: recipe.image,
          sourceUrl: recipe.sourceUrl,
          summary: recipe.summary,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions,
        }),
      });

      if (!response.ok) throw new Error("Failed to save recipe");
      alert(" Recipe saved successfully!");
      onSave();
    } catch (error) {
      alert(" Error saving recipe: " + error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="modal-header">
          <img src={recipe.image || "https://via.placeholder.com/400x300?text=No+Image"} alt={recipe.title} className="modal-image" />
        </div>
        <div className="modal-body">
          <h2>{recipe.title}</h2>
          {recipe.summary && (
            <div className="detail-section">
              <h4>📝 Summary</h4>
              <div dangerouslySetInnerHTML={{ __html: recipe.summary }}></div>
            </div>
          )}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="detail-section">
              <h4> Ingredients</h4>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.amount && <span className="amount">{ing.amount}</span>}
                    <span>{ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recipe.instructions && (
            <div className="detail-section">
              <h4>👨‍🍳👨‍🍳 Instructions</h4>
              <div dangerouslySetInnerHTML={{ __html: recipe.instructions }}></div>
            </div>
          )}
          {recipe.sourceUrl && (
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
              🔗 View Original Recipe
            </a>
          )}
          <div className="modal-actions">
            {!isSaved && (
              <button className="btn-primary" onClick={handleSave}>
                💾 Save Recipe
              </button>
            )}
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

//  Create Recipe Form
function CreateRecipeForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    sourceUrl: "",
    summary: "",
    instructions: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a recipe title");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create recipe");
      alert(" Recipe created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      alert(" Error creating recipe: " + error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>➕ Create New Recipe</h2>
        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group">
            <label>Recipe Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Spaghetti Carbonara" required />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </div>
          <div className="form-group">
            <label>Source URL</label>
            <input type="url" name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} placeholder="https://example.com/recipe" />
          </div>
          <div className="form-group">
            <label>Summary</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Describe the recipe..." rows="3" />
          </div>
          <div className="form-group">
            <label>Instructions</label>
            <textarea name="instructions" value={formData.instructions} onChange={handleChange} placeholder="Step-by-step instructions..." rows="4" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">✅ Create Recipe</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🎮 Main App Component
export default function App() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [stats, setStats] = useState({ totalRecipes: 0, recentRecipes: 0 });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [viewSaved, setViewSaved] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");

  const loadSavedRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/recipes`);
      if (!response.ok) throw new Error("Failed to load recipes");
      const data = await response.json();
      setSavedRecipes(data.data || []);
      setViewSaved(true);
    } catch (error) {
      setError("Failed to load recipes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/recipes/stats/summary`);
      if (!response.ok) throw new Error("Failed to load stats");
      const data = await response.json();
      setStats(data.data || {});
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }, []);

  useEffect(() => {
    loadSavedRecipes();
    loadStats();
  }, [loadSavedRecipes, loadStats]);

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter a search term");
      return;
    }
    setLoading(true);
    setError("");
    setViewSaved(false);
    try {
      const response = await fetch(`${API_BASE}/recipes/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data.data || []);
    } catch (error) {
      setError("Search failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await fetch(`${API_BASE}/recipes/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Delete failed");
        alert("✅ Recipe deleted successfully!");
        loadSavedRecipes();
        loadStats();
      } catch (error) {
        alert("❌ Error deleting recipe: " + error.message);
      }
    }
  };

  const displayedRecipes = viewSaved ? savedRecipes : results;

  return (
    <div className="app-container">
      <header className="header">
        <h1>🍳 Recipe Manager</h1>
        <p>Discover, save, and manage your favorite recipes</p>
      </header>

      <HeroSearch query={query} setQuery={setQuery} onSearch={handleSearch} loading={loading} />

      <StatsBar stats={stats} />

      <div className="controls">
        <button className={`btn-control ${viewSaved ? "active" : ""}`} onClick={loadSavedRecipes}>
          💾 My Recipes ({savedRecipes.length})
        </button>
        <button className="btn-control btn-create" onClick={() => setShowCreateForm(true)}>
          ➕ Create Recipe
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="recipes-section">
        <h2 className="section-title">
          {viewSaved ? "Your Saved Recipes" : `Search Results for "${query}"`}
        </h2>

        {loading ? (
          <div className="loading-state">⏳ Loading recipes...</div>
        ) : displayedRecipes.length > 0 ? (
          <div className="recipes-grid">
            {displayedRecipes.map((recipe) => (
              <RecipeCard key={recipe._id || recipe.id} recipe={recipe} onSelect={setSelectedRecipe} onDelete={handleDeleteRecipe} isSaved={viewSaved} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h3>{viewSaved ? "No saved recipes yet" : "No recipes found"}</h3>
            <p>{viewSaved ? "Search for recipes above and save your favorites!" : "Try a different search term"}</p>
          </div>
        )}
      </div>

      {selectedRecipe && (
        <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} onSave={loadSavedRecipes} isSaved={viewSaved} />
      )}

      {showCreateForm && (
        <CreateRecipeForm onClose={() => setShowCreateForm(false)} onSuccess={() => { loadSavedRecipes(); loadStats(); }} />
      )}
    </div>
  );
}