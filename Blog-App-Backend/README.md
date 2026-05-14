# Blog App Backend

The Express.js backend for the MERN Blog Application. This server handles user authentication, article management, and role-based access control with MongoDB as the database.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Middleware](#middleware)
- [Models](#models)
- [Services](#services)
- [Error Handling](#error-handling)

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)
- Cloudinary account

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URL=mongodb://localhost:27017/blog-app
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF

# Start server
npm start
```

Server will be running at `http://localhost:5000`

## 📁 Project Structure

```
Blog-App-Backend/
├── APIs/                          # Route handlers and controllers
│   ├── AdminAPI.js               # Admin routes and controllers
│   ├── AuthorAPI.js              # Author-specific routes
│   ├── CommonAPI.js              # Authentication and article routes
│   └── UserAPI.js                # User-specific routes
│
├── config/                        # Configuration files
│   ├── cloudinary.js             # Cloudinary initialization
│   ├── cloudinaryUpload.js       # Image upload middleware
│   └── multer.js                 # Multer file upload config
│
├── middlewares/                   # Custom middleware functions
│   ├── verifyToken.js            # JWT token verification
│   ├── checkUser.js              # User role verification
│   ├── checkAuthor.js            # Author role verification
│   └── checkAdmin.js             # Admin role verification
│
├── models/                        # MongoDB schemas and models
│   ├── UserModel.js              # User schema with roles
│   └── ArticleModel.js           # Article schema with metadata
│
├── services/                      # Business logic layer
│   └── authService.js            # Authentication business logic
│
├── server.js                      # Express server entry point
├── package.json                   # Project dependencies
├── authorReq.http                # Sample requests for testing
├── userReq.http                  # Sample requests for testing
└── .env                          # Environment variables (not in repo)
```

## 🔌 API Endpoints

### Authentication (CommonAPI)

#### Register User/Author
```
POST /api/common/register
Content-Type: application/json

{
  "username": "user123",
  "password": "password123",
  "email": "user@example.com",
  "role": "user" // or "author"
}

Response: { success: true, message: "User registered", token: "JWT" }
```

#### Login
```
POST /api/common/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { success: true, token: "JWT", user: {...} }
```

#### Logout
```
POST /api/common/logout
Authorization: Bearer JWT_TOKEN

Response: { success: true, message: "Logged out successfully" }
```

### Articles (CommonAPI & AuthorAPI)

#### Get All Articles
```
GET /api/common/articles?page=1&limit=10&search=query

Response: { success: true, articles: [...], total: 100 }
```

#### Get Article by ID
```
GET /api/common/articles/:id

Response: { success: true, article: {...} }
```

#### Create Article (Author Only)
```
POST /api/author/articles
Authorization: Bearer JWT_TOKEN
Content-Type: multipart/form-data

{
  "title": "Article Title",
  "content": "Article content here",
  "category": "Technology",
  "image": <file>
}

Response: { success: true, article: {...} }
```

#### Update Article (Author Only)
```
PUT /api/author/articles/:id
Authorization: Bearer JWT_TOKEN
Content-Type: multipart/form-data

{
  "title": "Updated Title",
  "content": "Updated content",
  "category": "Technology",
  "image": <file> // optional
}

Response: { success: true, article: {...} }
```

#### Delete Article (Author Only)
```
DELETE /api/author/articles/:id
Authorization: Bearer JWT_TOKEN

Response: { success: true, message: "Article deleted" }
```

### User Routes (UserAPI)

#### Get User Profile
```
GET /api/user/profile
Authorization: Bearer JWT_TOKEN

Response: { success: true, user: {...} }
```

#### Update User Profile
```
PUT /api/user/profile
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "username": "newname",
  "bio": "User bio",
  "avatar": "url"
}

Response: { success: true, user: {...} }
```

#### Get User's Articles/Favorites
```
GET /api/user/articles
Authorization: Bearer JWT_TOKEN

Response: { success: true, articles: [...] }
```

### Author Routes (AuthorAPI)

#### Get Author Profile
```
GET /api/author/profile
Authorization: Bearer JWT_TOKEN

Response: { success: true, author: {...} }
```

#### Get Author's Articles
```
GET /api/author/articles
Authorization: Bearer JWT_TOKEN

Response: { success: true, articles: [...] }
```

#### Update Author Profile
```
PUT /api/author/profile
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "username": "author_name",
  "bio": "Author bio",
  "avatar": "url"
}

Response: { success: true, author: {...} }
```

### Admin Routes (AdminAPI)

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer JWT_TOKEN (Admin only)

Response: { success: true, users: [...] }
```

#### Get All Authors
```
GET /api/admin/authors
Authorization: Bearer JWT_TOKEN (Admin only)

Response: { success: true, authors: [...] }
```

#### Delete User
```
DELETE /api/admin/users/:id
Authorization: Bearer JWT_TOKEN (Admin only)

Response: { success: true, message: "User deleted" }
```

#### Delete Author
```
DELETE /api/admin/authors/:id
Authorization: Bearer JWT_TOKEN (Admin only)

Response: { success: true, message: "Author deleted" }
```

#### Get Articles for Moderation
```
GET /api/admin/articles
Authorization: Bearer JWT_TOKEN (Admin only)

Response: { success: true, articles: [...] }
```

#### Approve/Reject Article
```
PUT /api/admin/articles/:id
Authorization: Bearer JWT_TOKEN (Admin only)
Content-Type: application/json

{
  "status": "approved" // or "rejected"
}

Response: { success: true, article: {...} }
```

## 🔐 Middleware

### verifyToken.js
- Verifies JWT token from Authorization header
- Decodes token and extracts user information
- Adds user data to request object
- Returns 401 if token is missing or invalid

```javascript
middleware: verifyToken
```

### checkUser.js
- Verifies user has "user" role
- Should be used after verifyToken
- Returns 403 if user is not authorized

```javascript
middleware: verifyToken, checkUser
```

### checkAuthor.js
- Verifies user has "author" role
- Should be used after verifyToken
- Returns 403 if user is not an author

```javascript
middleware: verifyToken, checkAuthor
```

### checkAdmin.js
- Verifies user has "admin" role
- Should be used after verifyToken
- Returns 403 if user is not an admin

```javascript
middleware: verifyToken, checkAdmin
```

### File Upload (multer & cloudinary)
- Handles file upload from forms
- Validates file types and sizes
- Uploads to Cloudinary
- Returns image URL

```javascript
middleware: upload.single('image')
```

## 📊 Models

### UserModel

```javascript
{
  username: String,           // Unique username
  email: String,              // Unique email
  password: String,           // Hashed password
  role: String,               // "user" or "author" or "admin"
  bio: String,                // User biography
  avatar: String,             // Avatar URL
  articles: [ObjectId],       // References to articles (for authors)
  likedArticles: [ObjectId],  // References to liked articles
  createdAt: Date,
  updatedAt: Date
}
```

### ArticleModel

```javascript
{
  title: String,              // Article title
  content: String,            // Article content
  author: ObjectId,           // Reference to author user
  authorName: String,         // Author name (denormalized)
  category: String,           // Article category
  image: String,              // Article image URL (Cloudinary)
  description: String,        // Short description
  views: Number,              // View count
  likes: Number,              // Like count
  comments: [Object],         // Comments array
  status: String,             // "draft", "published", "rejected"
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠 Services

### authService.js

Business logic for authentication operations:

```javascript
// Hash password
hashPassword(password) -> hashedPassword

// Compare passwords
comparePassword(password, hashedPassword) -> boolean

// Generate JWT token
generateToken(userId, userRole) -> token

// Verify JWT token
verifyToken(token) -> decoded

// Register new user
registerUser(userData) -> user

// Login user
loginUser(email, password) -> { token, user }
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000

# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/blog-app?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_12345

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# CORS
FRONTEND_URL=http://localhost:5173

# Email (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret
3. Add credentials to `.env`

### MongoDB Setup

**Local MongoDB:**
```
MONGODB_URL=mongodb://localhost:27017/blog-app
```

**MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Add connection string to `.env`

## 🚨 Error Handling

Standard error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized (no token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate entry)
- `500`: Server Error

## 🧪 Testing Endpoints

Use the provided `.http` files for testing:

- `authorReq.http` - Author API testing
- `userReq.http` - User API testing

**VS Code Extension:** Install "REST Client" extension to test directly from .http files.

**Or use curl:**
```bash
curl -X GET http://localhost:5000/api/common/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Running the Server

### Development (with auto-reload)
```bash
npx nodemon server.js
```

### Production
```bash
npm start
```

### With Custom Port
```bash
PORT=8000 npm start
```

## 📦 Dependencies

```json
{
  "bcryptjs": "^3.0.3",           // Password hashing
  "cloudinary": "^2.9.0",         // Image hosting
  "cookie-parser": "^1.4.7",      // Cookie handling
  "cors": "^2.8.6",               // Cross-origin requests
  "dotenv": "^17.2.3",            // Environment variables
  "express": "^5.2.1",            // Web framework
  "jsonwebtoken": "^9.0.3",       // JWT authentication
  "mongoose": "^9.1.5",           // MongoDB ODM
  "multer": "^2.1.1"              // File upload
}
```

## 🔍 Debugging

Enable detailed logging:

```javascript
// In server.js
process.env.DEBUG = 'blog-app:*'
```

## 📝 Notes

- All passwords are hashed using bcryptjs before storage
- JWT tokens expire in 7 days (configurable)
- Image uploads are limited to 5MB by default
- Articles require review before publishing (can be configured)
- CORS is configured to accept requests from frontend URL

## 🤝 Contributing

Follow these guidelines:
1. Create feature branches
2. Follow existing code style
3. Add comments for complex logic
4. Test all endpoints before committing

---

**Need help?** Check the main [README.md](../README.md) for project overview. 