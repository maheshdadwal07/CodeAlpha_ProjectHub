# ProjectHub Server - Backend API

Backend server for ProjectHub built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ installed
- MongoDB installed and running
- npm or yarn package manager

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Setup environment variables**

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your configuration
```

3. **Start MongoDB**

```bash
mongod
```

4. **Start development server**

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/          # Configuration files
│   └── db.js       # Database connection
├── controllers/     # Route controllers
│   └── authController.js
├── models/         # Database models
│   └── User.js
├── routes/         # API routes
│   └── auth.js
├── middleware/     # Custom middleware
│   ├── auth.js    # Authentication middleware
│   └── error.js   # Error handling middleware
├── utils/          # Utility functions
│   ├── asyncHandler.js
│   └── errorResponse.js
├── .env           # Environment variables (not in git)
├── .env.example   # Environment variables template
├── server.js      # Entry point
└── package.json   # Dependencies
```

## 🔧 Available Scripts

```bash
# Start production server
npm start

# Start development server with nodemon
npm run dev

# Run tests (to be implemented)
npm test
```

## 🗄️ Database

This project uses MongoDB. Make sure MongoDB is running before starting the server.

**Default connection:** `mongodb://localhost:27017/projecthub`

## 🔐 Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/projecthub
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/updateprofile` - Update profile (Protected)
- `PUT /api/auth/updatepassword` - Update password (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

See `API_TESTING.md` for detailed API documentation.

## 🧪 Testing

Use Thunder Client, Postman, or REST Client to test the API.

Import the `thunder-collection.json` file into Thunder Client for ready-to-use requests.

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Protected routes require:**

```
Authorization: Bearer <token>
```

## 📝 Notes

- Passwords are hashed using bcrypt
- JWT tokens expire in 7 days (configurable)
- CORS is enabled for frontend development
- Error handling middleware catches all errors

## 🐛 Debugging

**If MongoDB connection fails:**

1. Check if MongoDB is running
2. Verify MONGODB_URI in .env
3. Check MongoDB logs

**If authentication fails:**

1. Verify JWT_SECRET is set in .env
2. Check token format in Authorization header
3. Ensure token hasn't expired

## 👨‍💻 Development

Day 2 Progress:

- ✅ Express server setup
- ✅ MongoDB connection
- ✅ User model with password hashing
- ✅ JWT authentication
- ✅ Register/Login endpoints
- ✅ Protected routes
- ✅ Error handling middleware
- ✅ Input validation

## 🔜 Coming Next (Day 3)

- Project model & CRUD operations
- Task model & operations
- Comment system
- Authorization middleware
- Real-time features with Socket.io
