# Dressify - MongoDB, Express, Node.js Backend Setup Guide

## 🚀 Complete Backend Migration from Appwrite

Your Dressify app has been successfully migrated from Appwrite to a custom MongoDB, Express, and Node.js backend with the following features:

### ✅ What's Been Implemented

1. **Backend Architecture** (`backend/`)
   - Express.js server with security middleware (helmet, cors, rate limiting)
   - MongoDB integration with Mongoose ODM
   - JWT-based authentication system
   - RESTful API endpoints for all features

2. **Database Models** (`backend/models/`)
   - **User**: Authentication, profiles, followers/following
   - **Post**: Social media posts with likes, comments, media
   - **Comment**: Nested comments system with likes
   - **Chat**: Direct messaging between users
   - **Message**: Chat messages with media support

3. **API Endpoints** (`backend/routes/`)
   - **Auth**: `/api/auth` - Register, login, logout, get current user
   - **Posts**: `/api/posts` - CRUD operations, likes, user posts
   - **Comments**: `/api/comments` - Add comments, get post comments
   - **Users**: `/api/users` - User profiles, update profile
   - **Chats**: `/api/chats` - Create chats, send/get messages

4. **Frontend Integration** (`lib/api.ts`)
   - New API service replacing Appwrite
   - Updated AuthContext for new backend
   - AsyncStorage for token management

### 🛠️ Setup Instructions

#### 1. Database Setup
```bash
# Install MongoDB locally or use MongoDB Atlas
# For local MongoDB:
# Download and install MongoDB Community Server
# Start MongoDB service

# For MongoDB Atlas:
# Create account at https://www.mongodb.com/atlas
# Create cluster and get connection string
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# Copy environment file
cp .env.example .env

# Update .env with your MongoDB URI:
# MONGODB_URI=mongodb://localhost:27017/dressify
# or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dressify

# Start the backend server
npm run dev
```

#### 3. Frontend Setup
```bash
# Navigate to main directory
cd ..

# Install dependencies (already done)
npm install

# Environment is already configured in .env
# EXPO_PUBLIC_API_URL=http://localhost:5000/api

# Start the frontend
npm start
```

### 🔧 Available Scripts

#### Backend (`backend/`)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

#### Frontend (main directory)
- `npm start` - Start Expo development server
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS
- `npm run web` - Start web version

### 📡 API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

#### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create new post
- `GET /api/posts/user/:userId` - Get user posts
- `PUT /api/posts/:id/like` - Toggle like on post
- `DELETE /api/posts/:id` - Delete post

#### Comments
- `POST /api/comments` - Add comment to post
- `GET /api/comments/:postId` - Get post comments

#### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Chats
- `GET /api/chats` - Get user chats
- `POST /api/chats` - Create or get chat
- `POST /api/chats/:chatId/messages` - Send message
- `GET /api/chats/:chatId/messages` - Get chat messages

### 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with express-validator
- MongoDB injection protection

### 🗄️ Database Schema

#### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  followers: [ObjectId],
  following: [ObjectId],
  isVerified: Boolean,
  role: String (user/admin)
}
```

#### Posts Collection
```javascript
{
  user: ObjectId (ref: User),
  content: String,
  images: [{ url, publicId }],
  videos: [{ url, publicId }],
  likes: [{ user: ObjectId, createdAt: Date }],
  comments: [ObjectId],
  tags: [String],
  isPublic: Boolean,
  likesCount: Number,
  commentsCount: Number
}
```

### 🚀 Deployment

#### Backend Deployment
1. Deploy to services like Heroku, Railway, or DigitalOcean
2. Set environment variables in production
3. Use MongoDB Atlas for production database

#### Frontend Deployment
1. Build with `expo build`
2. Deploy to app stores or web hosting

### ✅ Migration Complete

- ✅ Removed Appwrite dependencies
- ✅ Created custom MongoDB backend
- ✅ Updated frontend to use new API
- ✅ Implemented all authentication features
- ✅ Added social media functionality
- ✅ Secured API endpoints
- ✅ Hidden sensitive configuration

Your Dressify app is now running on a complete MongoDB, Express, and Node.js backend!
