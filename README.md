#  Recipe Manager - Full scope API Project


This is a fullscope APi project works on web applications it demonstrates restful api principle the spoonacular api is being integrated using which users can perform crud operations 
-  Search 500,000+ recipes via Spoonacular API
-  Savefavorite recipes to MongoDB
- Create custom recipes
- Read all saved recipes
- Update recipe details
- Delete unwanted recipes
-View statistics dashboard

***Features*** 
 Complete CRUD operations  
 RESTful API design  
 External API integration (Spoonacular - properly cited)  
 MongoDB persistence  
React frontend with Vite  
Responsive UI design  
 Error handling & validation  

This project has provided confidence on integrating applications with RESTful API 

This project demonstrates mastery of:

### reference From Textbook Chapters:

**Chapters 2-3: RESTful API Design**
-  Resource-based URL structure (`/api/recipes`)
-  Proper HTTP methods (GET, POST, PATCH, DELETE)
-  Plural resource naming
-  Stateless architecture

**Chapter 4: Request/Response Design**
- Consistent response format (`success`, `data`, `error`)
-  Appropriate HTTP status codes (200, 201, 400, 404, 500)
-  Query parameters for filtering
-  Validation and error messages

**Chapters 6-7: Developer Experience**
-  Self-documenting API endpoints
-  Clear error messages
- Consistent naming conventions


**Chapter 8: Integrations**
-  Third-party API integration (Spoonacular)
-  Error handling for external services


---

##  Tech

### Backend
Node.js v14+ - JavaScript runtime
Express.js v5.1.0 - Web framework
MongoDB - NoSQL database
Mongoose v8.19.1 - ODM for MongoDB
Axios v1.12.2 - HTTP client
CORS v2.8.5 - Cross-origin support
Morgan v1.10.1 - Request logging
dotenv v17.2.3 - Environment variables

### Frontend
React v19.2.0 - UI library
Vite v5.0.8 - Build tool
Native Fetch API - HTTP requests
CSS3- Styling

### External Services
Spoonacular API - Recipe data source
MongoDB - Local or Atlas



### Project

cd recipe-manager

backend setup

cd backend

# Install dependencies
npm install

# Create .env file
# Copy this content:
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/recipe-manager
SPOONACULAR_API_KEY=786ae94773454ffba368a8e4a2c548e5

# Start backend server
npm run dev


**Expected Output:**
```

 Recipe Manager API Server
 Server running on http://localhost:3000
 Environment: development

 MongoDB connected
 Database: recipe-manager

# Open NEW terminal
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev


**Expected Output:**

 Local:   http://localhost:5173/


using front end 
1. Click "💾 My Recipes" button
2. All saved recipes display in grid 
3. Verify the test recipe created above appears




1. In "My Recipes" view
2. Click  View on test recipe
3. Modal opens showing full recipe details


 Search Spoonacular API
Frontend: http://localhost:5173
Type: "pasta" in search box
Click: Search button
Verify 10 recipe cards appear with images
 CREATE 


Click: "Create Recipe"
Success  appears
Open: MongoDB Compass
New document visible in recipes collection

 READ 

Click: My Recipes
Test recipe displays in grid
Click:  View
 shows full details


 UPDATE 

Postman/curl:
PATCH /api/recipes/{id}
Body: {"title": "GRADED"}
Returns 200 OK
Frontend: Refresh
Title changed to "GRADED"

 DELETE

Click: " Delete" on test recipe
Confirm: Yes
 Recipe disappears
MongoDB Compass: Refresh
Document removed




API Endpoints:
 [ ] GET /api/health returns 200 OK
 [ ] GET /api/recipes returns all recipes
[ ] GET /api/recipes/:id returns single recipe
 [ ] GET /api/recipes/:id with invalid ID returns 404
[ ] POST /api/recipes creates new recipe (201)
 [ ] POST /api/recipes without title returns 400
 [ ] PATCH /api/recipes/:id updates recipe (200)
 [ ] DELETE /api/recipes/:id removes recipe (200)
[ ] GET /api/recipes/search?query=pasta returns Spoonacular results
[ ] GET /api/recipes/stats/summary returns statistics

