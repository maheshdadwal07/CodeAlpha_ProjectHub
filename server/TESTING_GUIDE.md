# 🧪 API Testing Guide

## ✅ Server Status: RUNNING

```
🚀 Server: http://localhost:5000
✅ MongoDB: Connected to Atlas
📦 Database: projecthub
```

---

## 📋 Quick Testing Steps

### Method 1: Using VS Code Extension (Recommended)

**Install Extension:**

1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "Thunder Client" or "REST Client"
3. Install extension

**Using REST Client:**

- Open `test.http` file
- Click "Send Request" above each request block

**Using Thunder Client:**

- Import `thunder-collection.json`
- Run requests from Thunder Client panel

---

### Method 2: Using Browser

**Health Check:**

```
http://localhost:5000/
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

### Method 3: Using Postman

1. Import `thunder-collection.json` into Postman
2. Or manually create requests from `API_TESTING.md`

---

## 🔥 Test Sequence

### 1️⃣ Health Check

**URL:** `GET http://localhost:5000/`

**Expected:** Status 200, API running message

---

### 2️⃣ Register User

**URL:** `POST http://localhost:5000/api/auth/register`

**Body:**

```json
{
  "name": "Mahesh Dadwal",
  "email": "mahesh@projecthub.com",
  "password": "password123"
}
```

**Expected:**

- Status: 201
- Returns: user object + JWT token

**Save the token!** You'll need it for protected routes.

---

### 3️⃣ Login User

**URL:** `POST http://localhost:5000/api/auth/login`

**Body:**

```json
{
  "email": "mahesh@projecthub.com",
  "password": "password123"
}
```

**Expected:**

- Status: 200
- Returns: user object + JWT token

---

### 4️⃣ Get Current User (Protected)

**URL:** `GET http://localhost:5000/api/auth/me`

**Headers:**

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected:**

- Status: 200
- Returns: current user details

---

### 5️⃣ Update Profile (Protected)

**URL:** `PUT http://localhost:5000/api/auth/updateprofile`

**Headers:**

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**

```json
{
  "name": "Mahesh Dadwal Updated",
  "email": "maheshupdated@projecthub.com"
}
```

**Expected:**

- Status: 200
- Returns: updated user

---

### 6️⃣ Update Password (Protected)

**URL:** `PUT http://localhost:5000/api/auth/updatepassword`

**Headers:**

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**

```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Expected:**

- Status: 200
- Returns: new token

---

### 7️⃣ Logout (Protected)

**URL:** `POST http://localhost:5000/api/auth/logout`

**Headers:**

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected:**

- Status: 200
- Success message

---

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] Health check returns 200
- [ ] User registration works
- [ ] Login returns valid token
- [ ] Protected routes require token
- [ ] Invalid token returns 401
- [ ] Profile update works
- [ ] Password update works
- [ ] Logout works

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Cannot Connect to MongoDB

- Check Atlas whitelist (0.0.0.0/0)
- Verify credentials in .env
- Check network connection

### Token Invalid

- Token may be expired (7 days expiry)
- Check Authorization header format
- Re-login to get new token

---

## 📱 Next Steps

Once all tests pass:

1. ✅ Day 2 complete and tested
2. 🚀 Ready for Day 3 (Projects, Tasks, Comments)
3. 📊 Commit working code to GitHub

---

## 🎯 Success Criteria

✅ All 7 endpoints working
✅ JWT authentication working
✅ MongoDB storing data
✅ Error handling working
✅ Ready for frontend integration

**Server Status: 🟢 OPERATIONAL**

---

**Happy Testing! 🚀**
