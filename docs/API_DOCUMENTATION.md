# 📚 API Documentation - ProjectHub

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49eb801f1a4c8e4f5a",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-10-20T10:30:00.000Z"
  }
}
```

### Login User
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49eb801f1a4c8e4f5a",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Current User
**GET** `/auth/me` 🔒

Get currently logged in user details.

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49eb801f1a4c8e4f5a",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### Update Profile
**PUT** `/auth/updateprofile` 🔒

Update user profile information.

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49eb801f1a4c8e4f5a",
    "name": "John Updated",
    "email": "johnupdated@example.com"
  }
}
```

---

## 📊 Project Endpoints

### Get All Projects
**GET** `/projects` 🔒

Get all projects where user is owner or member.

**Query Parameters:**
- `status` (optional): Filter by status (active, archived, completed)

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "projects": [
    {
      "_id": "60d5ec49eb801f1a4c8e4f5b",
      "title": "Website Redesign",
      "description": "Redesign company website",
      "owner": {
        "_id": "60d5ec49eb801f1a4c8e4f5a",
        "name": "John Doe"
      },
      "members": ["60d5ec49eb801f1a4c8e4f5a"],
      "status": "active",
      "createdAt": "2025-10-20T10:30:00.000Z"
    }
  ]
}
```

### Create Project
**POST** `/projects` 🔒

Create a new project.

**Request Body:**
```json
{
  "title": "Mobile App Development",
  "description": "Build a new mobile app for iOS and Android",
  "status": "active"
}
```

**Response (201):**
```json
{
  "success": true,
  "project": {
    "_id": "60d5ec49eb801f1a4c8e4f5c",
    "title": "Mobile App Development",
    "description": "Build a new mobile app for iOS and Android",
    "owner": "60d5ec49eb801f1a4c8e4f5a",
    "members": ["60d5ec49eb801f1a4c8e4f5a"],
    "status": "active",
    "createdAt": "2025-10-20T11:00:00.000Z"
  }
}
```

### Get Project Details
**GET** `/projects/:id` 🔒

Get detailed information about a specific project.

**Response (200):**
```json
{
  "success": true,
  "project": {
    "_id": "60d5ec49eb801f1a4c8e4f5b",
    "title": "Website Redesign",
    "description": "Redesign company website",
    "owner": {
      "_id": "60d5ec49eb801f1a4c8e4f5a",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "_id": "60d5ec49eb801f1a4c8e4f5a",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "status": "active",
    "taskCount": 15,
    "createdAt": "2025-10-20T10:30:00.000Z"
  }
}
```

### Update Project
**PUT** `/projects/:id` 🔒

Update project information (owner only).

**Request Body:**
```json
{
  "title": "Website Redesign - Updated",
  "description": "Complete website overhaul",
  "status": "in-progress"
}
```

**Response (200):**
```json
{
  "success": true,
  "project": {
    "_id": "60d5ec49eb801f1a4c8e4f5b",
    "title": "Website Redesign - Updated",
    "description": "Complete website overhaul",
    "status": "in-progress"
  }
}
```

### Delete Project
**DELETE** `/projects/:id` 🔒

Delete a project (owner only).

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Add Member to Project
**POST** `/projects/:id/members` 🔒

Add a member to the project (owner only).

**Request Body:**
```json
{
  "email": "newmember@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "project": {
    "_id": "60d5ec49eb801f1a4c8e4f5b",
    "members": [
      "60d5ec49eb801f1a4c8e4f5a",
      "60d5ec49eb801f1a4c8e4f5d"
    ]
  }
}
```

---

## ✅ Task Endpoints

### Get All Tasks
**GET** `/tasks/:projectId` 🔒

Get all tasks for a specific project.

**Query Parameters:**
- `status` (optional): Filter by status (todo, in-progress, review, done)
- `assignedTo` (optional): Filter by assigned user ID

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "tasks": [
    {
      "_id": "60d5ec49eb801f1a4c8e4f5e",
      "title": "Design homepage mockup",
      "description": "Create high-fidelity mockup for homepage",
      "project": "60d5ec49eb801f1a4c8e4f5b",
      "assignedTo": {
        "_id": "60d5ec49eb801f1a4c8e4f5a",
        "name": "John Doe"
      },
      "createdBy": {
        "_id": "60d5ec49eb801f1a4c8e4f5a",
        "name": "John Doe"
      },
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2025-10-25T00:00:00.000Z",
      "position": 1,
      "createdAt": "2025-10-20T12:00:00.000Z"
    }
  ]
}
```

### Create Task
**POST** `/tasks` 🔒

Create a new task.

**Request Body:**
```json
{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication system",
  "project": "60d5ec49eb801f1a4c8e4f5b",
  "assignedTo": "60d5ec49eb801f1a4c8e4f5a",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-10-30T00:00:00.000Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "task": {
    "_id": "60d5ec49eb801f1a4c8e4f5f",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication system",
    "project": "60d5ec49eb801f1a4c8e4f5b",
    "assignedTo": "60d5ec49eb801f1a4c8e4f5a",
    "createdBy": "60d5ec49eb801f1a4c8e4f5a",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-10-30T00:00:00.000Z",
    "position": 1,
    "createdAt": "2025-10-20T13:00:00.000Z"
  }
}
```

### Get Task Details
**GET** `/tasks/:id` 🔒

Get detailed information about a specific task.

**Response (200):**
```json
{
  "success": true,
  "task": {
    "_id": "60d5ec49eb801f1a4c8e4f5e",
    "title": "Design homepage mockup",
    "description": "Create high-fidelity mockup for homepage",
    "project": {
      "_id": "60d5ec49eb801f1a4c8e4f5b",
      "title": "Website Redesign"
    },
    "assignedTo": {
      "_id": "60d5ec49eb801f1a4c8e4f5a",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdBy": {
      "_id": "60d5ec49eb801f1a4c8e4f5a",
      "name": "John Doe"
    },
    "status": "in-progress",
    "priority": "high",
    "commentCount": 3,
    "createdAt": "2025-10-20T12:00:00.000Z"
  }
}
```

### Update Task
**PUT** `/tasks/:id` 🔒

Update task information.

**Request Body:**
```json
{
  "title": "Design homepage mockup - Updated",
  "description": "Create high-fidelity mockup with mobile version",
  "status": "review",
  "priority": "high"
}
```

**Response (200):**
```json
{
  "success": true,
  "task": {
    "_id": "60d5ec49eb801f1a4c8e4f5e",
    "title": "Design homepage mockup - Updated",
    "description": "Create high-fidelity mockup with mobile version",
    "status": "review",
    "priority": "high"
  }
}
```

### Update Task Status
**PATCH** `/tasks/:id/status` 🔒

Update only the status of a task.

**Request Body:**
```json
{
  "status": "done"
}
```

**Response (200):**
```json
{
  "success": true,
  "task": {
    "_id": "60d5ec49eb801f1a4c8e4f5e",
    "status": "done"
  }
}
```

### Delete Task
**DELETE** `/tasks/:id` 🔒

Delete a task.

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## 💬 Comment Endpoints

### Get Task Comments
**GET** `/comments/:taskId` 🔒

Get all comments for a specific task.

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "comments": [
    {
      "_id": "60d5ec49eb801f1a4c8e4f60",
      "content": "Great progress on this task!",
      "task": "60d5ec49eb801f1a4c8e4f5e",
      "user": {
        "_id": "60d5ec49eb801f1a4c8e4f5a",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "createdAt": "2025-10-20T14:00:00.000Z"
    }
  ]
}
```

### Create Comment
**POST** `/comments` 🔒

Add a new comment to a task.

**Request Body:**
```json
{
  "content": "I've completed the mobile mockup as well.",
  "task": "60d5ec49eb801f1a4c8e4f5e"
}
```

**Response (201):**
```json
{
  "success": true,
  "comment": {
    "_id": "60d5ec49eb801f1a4c8e4f61",
    "content": "I've completed the mobile mockup as well.",
    "task": "60d5ec49eb801f1a4c8e4f5e",
    "user": "60d5ec49eb801f1a4c8e4f5a",
    "createdAt": "2025-10-20T15:00:00.000Z"
  }
}
```

### Update Comment
**PUT** `/comments/:id` 🔒

Update a comment (only by comment creator).

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response (200):**
```json
{
  "success": true,
  "comment": {
    "_id": "60d5ec49eb801f1a4c8e4f61",
    "content": "Updated comment content",
    "updatedAt": "2025-10-20T16:00:00.000Z"
  }
}
```

### Delete Comment
**DELETE** `/comments/:id` 🔒

Delete a comment (only by comment creator).

**Response (200):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## 🔔 Notification Endpoints

### Get User Notifications
**GET** `/notifications` 🔒

Get all notifications for the current user.

**Query Parameters:**
- `read` (optional): Filter by read status (true/false)
- `limit` (optional): Limit number of results (default: 20)

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "notifications": [
    {
      "_id": "60d5ec49eb801f1a4c8e4f62",
      "user": "60d5ec49eb801f1a4c8e4f5a",
      "type": "task_assigned",
      "message": "You have been assigned to task: Design homepage mockup",
      "link": "/tasks/60d5ec49eb801f1a4c8e4f5e",
      "read": false,
      "createdAt": "2025-10-20T12:00:00.000Z"
    }
  ]
}
```

### Mark Notification as Read
**PATCH** `/notifications/:id/read` 🔒

Mark a notification as read.

**Response (200):**
```json
{
  "success": true,
  "notification": {
    "_id": "60d5ec49eb801f1a4c8e4f62",
    "read": true
  }
}
```

### Delete Notification
**DELETE** `/notifications/:id` 🔒

Delete a notification.

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## ❌ Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Server error occurred"
}
```

---

## 🔐 Authentication Notes

- JWT tokens expire after 7 days
- Tokens must be included in the Authorization header for protected routes
- Use Bearer token format: `Authorization: Bearer <token>`

## 📝 Notes

- All timestamps are in ISO 8601 format
- All IDs are MongoDB ObjectIds
- 🔒 indicates protected routes requiring authentication
