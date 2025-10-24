# Testing Guide

## Prerequisites

1. Backend server running on http://localhost:5000
2. Frontend running on http://localhost:5173
3. MongoDB connected

## Test Credentials (from seed data)

```
Email: mahesh@test.com
Password: 123456
```

## How to Test

### 1. Start Backend Server

```bash
cd server
npm run dev
```

You should see:

- ✅ MongoDB Connected
- 🚀 Server running on port 5000

### 2. Start Frontend Server

```bash
cd client
npm run dev
```

Server should run on http://localhost:5173

### 3. Test Login (Recommended First)

1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: mahesh@test.com
   - Password: 123456
3. Click Login
4. Should redirect to Dashboard with projects

### 4. Test Registration (New User)

1. Go to http://localhost:5173/register
2. Fill in:
   - Name: Your Name
   - Email: your@email.com (use unique email)
   - Password: 123456
   - Confirm Password: 123456
3. Click Register
4. Should redirect to Dashboard

## Troubleshooting

### Registration Failed Error

Check browser console (F12 → Console) for errors:

- Network tab: Check if POST to /api/auth/register succeeded
- Console: Look for error messages

Common issues:

1. **Backend not running**: Start backend server
2. **CORS error**: Check if CLIENT_URL in server/.env matches frontend URL
3. **Database error**: Verify MongoDB connection
4. **Email already exists**: Use different email

### If Login Works but Registration Fails

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to register
4. Check the /api/auth/register request
5. Look at Response tab to see exact error

### Database Issues

Run seed script again:

```bash
cd server
node seed.js
```

## Expected UI After Seeding

- Dashboard shows 4 projects
- E-Commerce Website has 6 tasks (2 done, 2 in-progress, 2 todo)
- Mobile App Development has 4 tasks
- Data Analytics Dashboard has 3 tasks
- Blog Platform is marked as completed
