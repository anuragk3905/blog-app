# MERN Blog Application

A full-stack blogging platform built with MongoDB, Express, React, and Node.js (MERN stack). This application allows users to create, read, update, and delete blog articles with role-based access control for regular users and authors.

## 🎯 Features

### User Features
- **User Registration & Login**: Secure authentication with JWT tokens
- **Read Articles**: Browse and view published articles
- **User Profile**: View personal profile and user information
- **Comment on Articles**: Engage with content through comments

### Author Features
- **Create Articles**: Write and publish new blog posts
- **Edit Articles**: Modify existing articles
- **Manage Articles**: View and manage all authored articles
- **Author Profile**: Showcase author information and published works

### Admin Features
- **Manage Users**: View and manage platform users
- **Manage Authors**: Oversee author accounts
- **Manage Articles**: Review and moderate articles
- **Platform Statistics**: Admin dashboard and insights

### Technical Features
- **Image Upload**: Cloudinary integration for article images
- **Role-Based Access Control**: Different permissions for Users, Authors, and Admins
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: bcryptjs for password encryption
- **Responsive Design**: Tailwind CSS for mobile-friendly UI
- **Form Validation**: React Hook Form with validation
- **Toast Notifications**: Real-time user feedback with react-hot-toast
- **State Management**: Zustand for efficient state management

## 📁 Project Structure

```
blog-app/
├── Blog-App-Backend/          # Express backend server
│   ├── APIs/                  # Route handlers and controllers
│   │   ├── AdminAPI.js        # Admin routes
│   │   ├── AuthorAPI.js       # Author routes
│   │   ├── UserAPI.js         # User routes
│   │   └── CommonAPI.js       # Common routes (Auth, Articles)
│   ├── config/                # Configuration files
│   │   ├── cloudinary.js      # Cloudinary setup
│   │   ├── cloudinaryUpload.js # Upload middleware
│   │   └── multer.js          # File upload configuration
│   ├── middlewares/           # Custom middleware
│   │   ├── verifyToken.js     # JWT verification
│   │   ├── checkUser.js       # User role check
│   │   ├── checkAuthor.js     # Author role check
│   │   └── checkAdmin.js      # Admin role check
│   ├── models/                # MongoDB schemas
│   │   ├── UserModel.js       # User schema
│   │   └── ArticleModel.js    # Article schema
│   ├── services/              # Business logic
│   │   └── authService.js     # Authentication service
│   ├── server.js              # Express server entry point
│   ├── package.json
│   └── .env                   # Environment variables (not in repo)
│
└── frontend/                  # React Vite frontend
    ├── src/
    │   ├── components/        # React components
    │   │   ├── Header.jsx     # Navigation header
    │   │   ├── Footer.jsx     # Footer component
    │   │   ├── Home.jsx       # Home/articles feed
    │   │   ├── Login.jsx      # Login page
    │   │   ├── Register.jsx   # Registration page
    │   │   ├── WriteArticle.jsx # Create article
    │   │   ├── EditArticleForm.jsx # Edit article
    │   │   ├── ArticleByID.jsx # Single article view
    │   │   ├── AuthorArticles.jsx # Author's articles list
    │   │   ├── AuthorProfile.jsx # Author profile
    │   │   ├── UserProfile.jsx # User profile
    │   │   ├── ProtectedRoute.jsx # Route protection
    │   │   ├── RootLayout.jsx # Main layout
    │   │   ├── ErrorBoundary.jsx # Error handling
    │   │   └── Unauthorised.jsx # 403 page
    │   ├── store/
    │   │   └── authStore.js   # Zustand auth state
    │   ├── styles/
    │   │   └── common.js      # Common styles
    │   ├── assets/            # Static assets
    │   ├── App.jsx            # Main App component
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js         # Vite configuration
    ├── eslint.config.js
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account for image uploads

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd blog-app
```

#### 2. Backend Setup

```bash
cd Blog-App-Backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EOF

# Start backend server
npm start
# or for development with auto-reload
nodemon server.js
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in terminal)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/common/register` - Register new user/author
- `POST /api/common/login` - User login
- `POST /api/common/logout` - User logout

### Article Endpoints
- `GET /api/common/articles` - Get all articles
- `GET /api/common/articles/:id` - Get article by ID
- `POST /api/author/articles` - Create article (Author only)
- `PUT /api/author/articles/:id` - Update article (Author only)
- `DELETE /api/author/articles/:id` - Delete article (Author only)

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/articles` - Get user's liked articles

### Author Endpoints
- `GET /api/author/profile` - Get author profile
- `GET /api/author/articles` - Get author's articles
- `PUT /api/author/profile` - Update author profile

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `GET /api/admin/authors` - Get all authors
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/authors/:id` - Delete author

## 🔐 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication with three user roles:

1. **User**: Can read articles, create profile, like articles
2. **Author**: Can create, edit, delete their own articles
3. **Admin**: Can manage users, authors, and moderate content

Each role has protected routes that require authentication and role verification via middleware.

## 🛠 Development

### Backend Development Scripts
```bash
# Start server
npm start

# Run with nodemon (auto-reload)
nodemon server.js

# Test API endpoints
# Use provided .http files (authorReq.http, userReq.http)
```

### Frontend Development Scripts
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm lint
```

## 📦 Dependencies

### Backend
- **express**: Web server framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cloudinary**: Image storage service
- **multer**: File upload handling
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variables
- **cookie-parser**: Cookie parsing

### Frontend
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **zustand**: State management
- **react-hook-form**: Form management
- **tailwindcss**: Utility CSS framework
- **react-hot-toast**: Toast notifications
- **vite**: Build tool and dev server

## 🌐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/blog-app
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```
VITE_API_URL=https://blog-app-n4a9.onrender.com
```

## 🎨 UI/UX

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Feedback**: Toast notifications for user actions
- **Form Validation**: Client-side validation with react-hook-form
- **Error Handling**: ErrorBoundary component for crash prevention
- **Role-Based UI**: Different UI based on user role

## 🔗 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables in hosting platform
2. Connect GitHub repository
3. Deploy with automatic builds

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access if using MongoDB Atlas

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure multer configuration is correct

### CORS Errors
- Verify frontend URL is in backend CORS config
- Check cookie settings if using authentication

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please follow the existing code structure and naming conventions.

## 📧 Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Happy Blogging! 📝✨**
