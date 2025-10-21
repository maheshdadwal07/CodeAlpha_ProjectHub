# MongoDB Installation Guide for Windows

## Option 1: MongoDB Community Edition (Recommended)

### Download and Install

1. **Download MongoDB**

   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, Version: Latest
   - Download the MSI installer

2. **Install MongoDB**

   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Add MongoDB to PATH**

   ```
   C:\Program Files\MongoDB\Server\7.0\bin
   ```

   Add this to your System Environment Variables PATH

4. **Verify Installation**
   ```bash
   mongod --version
   mongo --version
   ```

---

## Option 2: MongoDB Atlas (Cloud - No Installation Required)

### Setup MongoDB Atlas (FREE)

1. **Create Account**

   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**

   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Create cluster (takes 3-5 minutes)

3. **Setup Database Access**

   - Go to Database Access
   - Add New Database User
   - Username: `projecthub_user`
   - Password: Generate secure password
   - User Privileges: Read and write to any database

4. **Setup Network Access**

   - Go to Network Access
   - Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://projecthub_user:<password>@cluster0.xxxxx.mongodb.net/projecthub?retryWrites=true&w=majority
   ```

---

## Option 3: Docker (If you have Docker installed)

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo

# Verify it's running
docker ps
```

---

## Quick Test After Installation

1. **Start MongoDB** (if using local installation)

   ```bash
   # Windows Service (usually auto-starts)
   net start MongoDB
   ```

2. **Test Connection**

   ```bash
   mongosh
   # or for older versions
   mongo
   ```

3. **Expected Output:**
   ```
   Current Mongosh Log ID: xxxxx
   Connecting to: mongodb://127.0.0.1:27017
   Using MongoDB: 7.0.x
   ```

---

## Recommended: MongoDB Atlas (Cloud)

### Why MongoDB Atlas?

- ✅ No installation required
- ✅ Free tier available
- ✅ Automatic backups
- ✅ Easy to use
- ✅ Production ready
- ✅ Accessible from anywhere

### For Development

Use **MongoDB Atlas** - It's easier and free!

### For Production

Also use **MongoDB Atlas** - It's reliable and scalable!

---

## After Setup

Update your `.env` file with the correct connection string:

**Local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017/projecthub
```

**MongoDB Atlas:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/projecthub?retryWrites=true&w=majority
```

Then test the server:

```bash
cd server
npm run dev
```

---

## Troubleshooting

### Error: "mongod not found"

- MongoDB not installed or not in PATH
- Use MongoDB Atlas instead (no installation needed)

### Error: "Connection failed"

- Check if MongoDB service is running
- Verify connection string in .env
- For Atlas: Check network access settings

### Error: "Authentication failed"

- Verify username/password in connection string
- Check database user permissions in Atlas

---

## Quick Start (Recommended Path)

1. **Use MongoDB Atlas** (5 minutes setup)
2. **Get connection string**
3. **Update .env file**
4. **Start server**
5. **Test API**

No installation, no hassle! 🚀
