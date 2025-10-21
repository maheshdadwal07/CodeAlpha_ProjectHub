# ProjectHub API Testing

## Base URL

```
http://localhost:5000
```

---

## Health Check

### Check API Status

```http
GET http://localhost:5000/
```

**Expected Response:**

```json
{
  "success": true,
  "message": "ProjectHub API is running",
  "version": "1.0.0"
}
```

---

## Authentication Endpoints

### 1. Register User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Mahesh Dadwal",
  "email": "mahesh@example.com",
  "password": "password123"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "67163abc...",
    "name": "Mahesh Dadwal",
    "email": "mahesh@example.com",
    "avatar": null,
    "createdAt": "2025-10-21T...",
    "updatedAt": "2025-10-21T..."
  }
}
```

---

### 2. Login User

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "mahesh@example.com",
  "password": "password123"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "67163abc...",
    "name": "Mahesh Dadwal",
    "email": "mahesh@example.com",
    "avatar": null
  }
}
```

---

### 3. Get Current User

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your_token_here>
```

**Expected Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "67163abc...",
    "name": "Mahesh Dadwal",
    "email": "mahesh@example.com",
    "avatar": null,
    "createdAt": "2025-10-21T...",
    "updatedAt": "2025-10-21T..."
  }
}
```

---

### 4. Update Profile

```http
PUT http://localhost:5000/api/auth/updateprofile
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "name": "Mahesh Dadwal Updated",
  "email": "maheshupdated@example.com"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "67163abc...",
    "name": "Mahesh Dadwal Updated",
    "email": "maheshupdated@example.com",
    "avatar": null
  }
}
```

---

### 5. Update Password

```http
PUT http://localhost:5000/api/auth/updatepassword
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "67163abc...",
    "name": "Mahesh Dadwal",
    "email": "mahesh@example.com"
  }
}
```

---

### 6. Logout

```http
POST http://localhost:5000/api/auth/logout
Authorization: Bearer <your_token_here>
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Please provide all required fields"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Route not found"
}
```

### 500 Server Error

```json
{
  "success": false,
  "error": "Server Error"
}
```

---

## Testing Instructions

1. **Start MongoDB**: Make sure MongoDB is running

   ```bash
   mongod
   ```

2. **Start Server**: Run the development server

   ```bash
   cd server
   npm run dev
   ```

3. **Test with VS Code Extension**:

   - Install "Thunder Client" or "REST Client" extension
   - Use the requests above

4. **Test with Postman**:

   - Import requests into Postman
   - Create a collection for organized testing

5. **Test Authentication Flow**:
   - Register a new user
   - Copy the token from response
   - Use token in Authorization header for protected routes
   - Test all CRUD operations

---

## Notes

- Save the token after login/register
- Include token in Authorization header as: `Bearer <token>`
- Token expires in 7 days (configurable in .env)
- All timestamps are in ISO 8601 format
