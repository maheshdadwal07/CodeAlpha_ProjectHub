# 🚀 ProjectHub - Collaborative Project Management Tool

A full-stack project management application similar to Trello/Asana, built with the MERN stack. ProjectHub enables teams to collaborate effectively with real-time updates, task assignments, and seamless communication.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)

## 📋 Features

### Core Features

- 🔐 **User Authentication** - Secure JWT-based authentication system
- 📊 **Project Boards** - Create and manage multiple projects with Kanban-style boards
- ✅ **Task Management** - Create, assign, and track tasks with different statuses
- 💬 **Comments & Communication** - Real-time commenting system within tasks
- 👥 **Team Collaboration** - Invite team members and assign roles
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

### Bonus Features

- 🔔 **Real-time Notifications** - Get instant updates using WebSockets
- 🔄 **Live Updates** - See changes in real-time as team members work
- 📈 **Task Progress Tracking** - Visual indicators for project completion
- 🎨 **Drag & Drop** - Intuitive task management with drag-and-drop interface

## 🛠️ Tech Stack

### Frontend

- **React.js** - UI library for building interactive interfaces
- **React Router** - Client-side routing
- **Redux Toolkit** - State management
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Socket.io** - WebSocket library for real-time features
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
ProjectHub/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── socket/           # Socket.io handlers
│   ├── server.js         # Entry point
│   └── package.json
├── docs/                 # Documentation
└── README.md
```

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model

```javascript
{
  title: String,
  description: String,
  owner: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  status: String (active, archived, completed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```javascript
{
  title: String,
  description: String,
  project: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  status: String (todo, in-progress, review, done),
  priority: String (low, medium, high),
  dueDate: Date,
  position: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model

```javascript
{
  content: String,
  task: ObjectId (ref: Task),
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model

```javascript
{
  user: ObjectId (ref: User),
  type: String (task_assigned, comment_added, task_updated),
  message: String,
  link: String,
  read: Boolean,
  createdAt: Date
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/maheshdadwal07/CodeAlpha_ProjectHub.git
cd CodeAlpha_ProjectHub
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies**

```bash
cd ../client
npm install
```

4. **Environment Setup**

Create `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/projecthub
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Create `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

5. **Start MongoDB**

```bash
# Make sure MongoDB is running
mongod
```

6. **Run the application**

Terminal 1 - Start Backend:

```bash
cd server
npm run dev
```

Terminal 2 - Start Frontend:

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update user profile

### Projects

- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project

### Tasks

- `GET /api/tasks/:projectId` - Get all tasks in a project
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

### Comments

- `GET /api/comments/:taskId` - Get all comments for a task
- `POST /api/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Notifications

- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

## 🔌 WebSocket Events

### Client Events

- `join_project` - Join a project room
- `leave_project` - Leave a project room
- `task_update` - Update task in real-time
- `new_comment` - Add new comment

### Server Events

- `task_created` - Notify task creation
- `task_updated` - Notify task updates
- `comment_added` - Notify new comments
- `notification` - Send real-time notifications

## 🎯 Development Roadmap

- [x] Day 1: Project Setup & Documentation
- [ ] Day 2: Backend Foundation (Auth & Server)
- [ ] Day 3: Core Backend Features (Projects, Tasks, Comments)
- [ ] Day 4: Frontend Setup & UI Components
- [ ] Day 5: Integration & Real-time Features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mahesh Dadwal**

- GitHub: [@maheshdadwal07](https://github.com/maheshdadwal07)

## 🙏 Acknowledgments

- Inspired by Trello and Asana
- Built as part of CodeAlpha Internship Program

---

⭐ Star this repo if you find it helpful!
