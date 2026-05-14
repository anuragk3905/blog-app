# Blog App Frontend

React + Vite frontend for the MERN Blog Application. A modern, responsive blogging platform with Tailwind CSS styling and real-time notifications.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Components](#components)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Form Handling](#form-handling)
- [API Integration](#api-integration)
- [Development](#development)

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- Backend server running on http://localhost:5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/                # React components
│   │   ├── Header.jsx            # Navigation header
│   │   ├── Footer.jsx            # Footer section
│   │   ├── Home.jsx              # Home page / Articles feed
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # User registration
│   │   ├── WriteArticle.jsx      # Create new article
│   │   ├── EditArticleForm.jsx   # Edit existing article
│   │   ├── ArticleByID.jsx       # Single article view
│   │   ├── AuthorArticles.jsx    # Author's article list
│   │   ├── AuthorProfile.jsx     # Author profile page
│   │   ├── UserProfile.jsx       # User profile page
│   │   ├── ProtectedRoute.jsx    # Route protection wrapper
│   │   ├── RootLayout.jsx        # Main layout wrapper
│   │   ├── ErrorBoundary.jsx     # Error fallback component
│   │   └── Unauthorised.jsx      # 403 error page
│   │
│   ├── store/
│   │   └── authStore.js          # Zustand authentication store
│   │
│   ├── styles/
│   │   └── common.js             # Common styled components
│   │
│   ├── assets/                   # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── App.jsx                   # Main App component
│   ├── App.css                   # Global styles
│   ├── index.css                 # Base styles
│   └── main.jsx                  # Entry point
│
├── public/                        # Static files
├── index.html                     # HTML entry point
├── vite.config.js                # Vite configuration
├── eslint.config.js              # ESLint rules
├── tailwind.config.js            # Tailwind CSS config
└── package.json
```

## 🧩 Components

### Header.jsx
Navigation bar component with:
- Logo and branding
- Navigation menu
- User profile link
- Logout button
- Responsive mobile menu

### Footer.jsx
Footer component with:
- Company info
- Quick links
- Social media
- Copyright info

### Home.jsx
Articles feed page with:
- Article list pagination
- Search functionality
- Filter by category
- Sort options
- Article preview cards

### Login.jsx
User login page with:
- Email input
- Password input
- Login button
- Remember me option
- Link to register

### Register.jsx
User registration page with:
- Username input
- Email input
- Password input
- Confirm password
- Role selection (User/Author)

### WriteArticle.jsx
Create new article page with:
- Title input
- Content editor
- Category selection
- Image upload
- Preview mode

### EditArticleForm.jsx
Edit existing article page with:
- Pre-filled form data
- Title editing
- Content editing
- Image replacement
- Publish/Draft toggle

### ArticleByID.jsx
Single article view with:
- Full article content
- Author information
- Comments section
- Like button
- Share options

### AuthorArticles.jsx
Author's articles management with:
- List of author's articles
- Edit/Delete options
- Draft/Published filter
- Statistics

### AuthorProfile.jsx
Author profile page with:
- Author bio
- Profile photo
- Articles count
- Followers count
- Edit profile button

### UserProfile.jsx
User profile page with:
- User bio
- Avatar
- Liked articles
- Following authors
- Edit profile button

### ProtectedRoute.jsx
Higher-order component for route protection

### RootLayout.jsx
Main layout wrapper with Header, Navigation, Footer

### ErrorBoundary.jsx
Error handling component with fallback UI

### Unauthorised.jsx
403 error page

## 🎯 State Management (Zustand)

### authStore.js

Global authentication state using Zustand:

```javascript
// Store structure
{
  user: { id, username, email, role, bio, avatar },
  token: null,
  isAuthenticated: false,
  
  // Actions
  login(email, password),
  register(userData),
  logout(),
  setUser(user),
  updateUser(updates)
}
```

**Usage:**
```jsx
import authStore from '../store/authStore';

function MyComponent() {
  const { user, isAuthenticated } = authStore();
  return <>{isAuthenticated && <p>Welcome!</p>}</>;
}
```

## 🛣️ Routing

React Router v7 configuration:

```
Routes:
- /                    -> Home (public)
- /login               -> Login (public)
- /register            -> Register (public)
- /articles/:id        -> Article detail (public)
- /author/:id          -> Author profile (public)
- /user/profile        -> User profile (protected: user)
- /author/profile      -> Author profile (protected: author)
- /write               -> Write article (protected: author)
- /edit/:id            -> Edit article (protected: author)
- /unauthorised        -> 403 page
```

## 🎨 Styling

### Tailwind CSS
Utility-first CSS framework with responsive design system.

**Custom Styles:**
- Global: `index.css`
- Component: `App.css`
- Styled components: `styles/common.js`

## 📝 Form Handling

### React Hook Form
Lightweight form management with validation:

```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => { /* handle */ };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      <button type="submit">Login</button>
    </form>
  );
}
```

## 🌐 API Integration

### Axios HTTP Client

```javascript
import axios from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Get articles
export const getArticles = async (page, limit) => {
  const { data } = await axios.get(`${API_URL}/common/articles`, {
    params: { page, limit }
  });
  return data;
};

// Create article
export const createArticle = async (formData, token) => {
  const { data } = await axios.post(`${API_URL}/author/articles`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};
```

## 🚨 Error Handling

### Toast Notifications
Real-time feedback using react-hot-toast:

```jsx
import toast from 'react-hot-toast';

toast.success('Success!');
toast.error('Error occurred');
toast.loading('Processing...');
```

## 🛠️ Development

### Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build
npm run lint     # Lint code
```

### Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.2",
  "axios": "^1.13.6",
  "zustand": "^5.0.11",
  "react-hook-form": "^7.71.2",
  "react-hot-toast": "^2.6.0",
  "tailwindcss": "^4.2.1",
  "vite": "^7.3.1"
}
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to:
- **Vercel**: Connect GitHub repository
- **Netlify**: Drop dist folder
- **AWS**: Use S3 + CloudFront

### Environment
Set `VITE_API_URL` to production backend URL.

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

**Need help?** Check the main [README.md](../README.md) for project overview.
