# 🗄️ Database Schema - ProjectHub

## Overview

ProjectHub uses MongoDB as the database with Mongoose ODM for schema validation and relationships.

---

## 📊 Collections

### 1. Users Collection

Stores user account information and authentication details.

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Don't return password by default
  },
  avatar: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `email`: Unique index for fast lookup
- `createdAt`: For sorting users by registration date

**Virtual Fields:**
- `projects`: All projects where user is owner or member
- `assignedTasks`: All tasks assigned to user

---

### 2. Projects Collection

Stores project/board information.

```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  owner: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `owner`: For finding projects by owner
- `members`: For finding projects by member
- `status`: For filtering by project status
- Compound index: `{ owner: 1, status: 1 }`

**Virtual Fields:**
- `tasks`: All tasks belonging to this project
- `taskCount`: Number of tasks in project
- `completionRate`: Percentage of completed tasks

**Cascade Delete:**
- When a project is deleted, all associated tasks, comments, and notifications are also deleted

---

### 3. Tasks Collection

Stores individual task/card information.

```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  project: {
    type: ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: {
    type: ObjectId,
    ref: 'User',
    default: null
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  position: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `project`: For finding all tasks in a project
- `assignedTo`: For finding tasks assigned to a user
- `status`: For filtering by task status
- Compound index: `{ project: 1, status: 1, position: 1 }`

**Virtual Fields:**
- `comments`: All comments on this task
- `commentCount`: Number of comments
- `isOverdue`: Boolean indicating if task is past due date

**Cascade Delete:**
- When a task is deleted, all associated comments are also deleted

---

### 4. Comments Collection

Stores comments on tasks.

```javascript
{
  _id: ObjectId,
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  task: {
    type: ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `task`: For finding all comments on a task
- `user`: For finding all comments by a user
- Compound index: `{ task: 1, createdAt: -1 }`

---

### 5. Notifications Collection

Stores user notifications for real-time updates.

```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'task_assigned',
      'task_updated',
      'comment_added',
      'task_completed',
      'project_invite',
      'mention'
    ],
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 200
  },
  link: {
    type: String,
    default: null
  },
  relatedTask: {
    type: ObjectId,
    ref: 'Task',
    default: null
  },
  relatedProject: {
    type: ObjectId,
    ref: 'Project',
    default: null
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000  // Auto-delete after 30 days
  }
}
```

**Indexes:**
- `user`: For finding all notifications for a user
- `read`: For filtering read/unread notifications
- Compound index: `{ user: 1, read: 1, createdAt: -1 }`
- TTL index on `createdAt` to auto-delete old notifications

---

## 🔗 Relationships

### User ↔ Project
- **One-to-Many**: A user can own multiple projects
- **Many-to-Many**: A user can be a member of multiple projects

### Project ↔ Task
- **One-to-Many**: A project can have multiple tasks
- **Cascade Delete**: Deleting a project deletes all its tasks

### Task ↔ User
- **Many-to-One**: Multiple tasks can be assigned to one user
- **Many-to-One**: Multiple tasks can be created by one user

### Task ↔ Comment
- **One-to-Many**: A task can have multiple comments
- **Cascade Delete**: Deleting a task deletes all its comments

### User ↔ Notification
- **One-to-Many**: A user can have multiple notifications
- **Auto-Delete**: Notifications older than 30 days are automatically deleted

---

## 📈 Example Queries

### Get User's Projects
```javascript
Project.find({
  $or: [
    { owner: userId },
    { members: userId }
  ]
})
.populate('owner', 'name email avatar')
.populate('members', 'name email avatar')
.sort('-createdAt');
```

### Get Project Tasks by Status
```javascript
Task.find({ 
  project: projectId,
  status: 'in-progress'
})
.populate('assignedTo', 'name email avatar')
.populate('createdBy', 'name email')
.sort('position');
```

### Get Task with Comments
```javascript
Task.findById(taskId)
.populate('project', 'title')
.populate('assignedTo', 'name email avatar')
.populate({
  path: 'comments',
  populate: { path: 'user', select: 'name email avatar' },
  options: { sort: '-createdAt' }
});
```

### Get Unread Notifications
```javascript
Notification.find({
  user: userId,
  read: false
})
.sort('-createdAt')
.limit(20);
```

---

## 🔒 Security Considerations

1. **Password Hashing**: User passwords are hashed using bcrypt before storage
2. **Selective Field Returns**: Password field is excluded from queries by default
3. **Input Validation**: All fields have validation rules and max lengths
4. **Index Optimization**: Indexes on frequently queried fields for performance
5. **TTL Indexes**: Automatic cleanup of old notifications

---

## 🚀 Optimization Strategies

1. **Indexing**: Strategic indexes on commonly queried fields
2. **Population Limits**: Only populate necessary fields to reduce data transfer
3. **Pagination**: Implement pagination for large result sets
4. **Caching**: Consider Redis for frequently accessed data
5. **Aggregation**: Use MongoDB aggregation for complex queries

---

## 📝 Migration Notes

When updating the database schema:
1. Create a backup before migrations
2. Test migrations in development first
3. Use transactions for multi-document updates
4. Document all schema changes
5. Update API documentation accordingly
