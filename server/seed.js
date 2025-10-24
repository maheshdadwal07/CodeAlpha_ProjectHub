import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected for seeding");

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create users
    const user1 = await User.create({
      name: "Mahesh Dadwal",
      email: "mahesh@test.com",
      password: "123456",
    });

    const user2 = await User.create({
      name: "Rahul Kumar",
      email: "rahul@test.com",
      password: "123456",
    });

    const user3 = await User.create({
      name: "Priya Sharma",
      email: "priya@test.com",
      password: "123456",
    });

    console.log("✅ Created 3 users");

    // Create projects
    const project1 = await Project.create({
      title: "E-Commerce Website",
      description:
        "Build a full-stack e-commerce platform with payment integration",
      owner: user1._id,
      members: [user1._id, user2._id],
      status: "active",
    });

    const project2 = await Project.create({
      title: "Mobile App Development",
      description: "React Native app for food delivery service",
      owner: user1._id,
      members: [user1._id, user3._id],
      status: "active",
    });

    const project3 = await Project.create({
      title: "Data Analytics Dashboard",
      description: "Real-time analytics dashboard using D3.js and Node.js",
      owner: user2._id,
      members: [user2._id, user1._id, user3._id],
      status: "active",
    });

    const project4 = await Project.create({
      title: "Blog Platform",
      description: "Medium-like blog platform with rich text editor",
      owner: user3._id,
      members: [user3._id, user2._id],
      status: "completed",
    });

    console.log("✅ Created 4 projects");

    // Create tasks for project 1
    await Task.create([
      {
        title: "Setup Project Structure",
        description: "Initialize React app and setup folder structure",
        project: project1._id,
        assignedTo: user1._id,
        createdBy: user1._id,
        status: "done",
        priority: "high",
        position: 0,
      },
      {
        title: "Design Database Schema",
        description: "Create MongoDB models for products, users, orders",
        project: project1._id,
        assignedTo: user2._id,
        createdBy: user1._id,
        status: "done",
        priority: "high",
        position: 1,
      },
      {
        title: "Build Product Listing Page",
        description: "Create product grid with filters and search",
        project: project1._id,
        assignedTo: user1._id,
        createdBy: user1._id,
        status: "in-progress",
        priority: "medium",
        position: 0,
      },
      {
        title: "Implement Shopping Cart",
        description: "Add to cart functionality with Redux state management",
        project: project1._id,
        assignedTo: user2._id,
        createdBy: user1._id,
        status: "in-progress",
        priority: "high",
        position: 1,
      },
      {
        title: "Payment Gateway Integration",
        description: "Integrate Stripe/Razorpay for payments",
        project: project1._id,
        assignedTo: user1._id,
        createdBy: user1._id,
        status: "todo",
        priority: "high",
        position: 0,
      },
      {
        title: "Order Management System",
        description: "Admin panel for managing orders",
        project: project1._id,
        assignedTo: user2._id,
        createdBy: user1._id,
        status: "todo",
        priority: "medium",
        position: 1,
      },
    ]);

    // Create tasks for project 2
    await Task.create([
      {
        title: "Design UI Mockups",
        description: "Create Figma designs for all screens",
        project: project2._id,
        assignedTo: user3._id,
        createdBy: user1._id,
        status: "done",
        priority: "high",
        position: 0,
      },
      {
        title: "Setup React Native Project",
        description: "Initialize RN project with navigation",
        project: project2._id,
        assignedTo: user1._id,
        createdBy: user1._id,
        status: "in-progress",
        priority: "high",
        position: 0,
      },
      {
        title: "Build Authentication Flow",
        description: "Login, Register, OTP verification screens",
        project: project2._id,
        assignedTo: user3._id,
        createdBy: user1._id,
        status: "todo",
        priority: "high",
        position: 0,
      },
      {
        title: "Restaurant Listing API",
        description: "Backend API for fetching restaurants",
        project: project2._id,
        assignedTo: user1._id,
        createdBy: user1._id,
        status: "todo",
        priority: "medium",
        position: 1,
      },
    ]);

    // Create tasks for project 3
    await Task.create([
      {
        title: "Setup Data Pipeline",
        description: "Connect to data sources and setup ETL",
        project: project3._id,
        assignedTo: user2._id,
        createdBy: user2._id,
        status: "in-progress",
        priority: "high",
        position: 0,
      },
      {
        title: "Create Chart Components",
        description: "Build reusable D3.js chart components",
        project: project3._id,
        assignedTo: user1._id,
        createdBy: user2._id,
        status: "todo",
        priority: "medium",
        position: 0,
      },
      {
        title: "Implement Real-time Updates",
        description: "WebSocket integration for live data",
        project: project3._id,
        assignedTo: user3._id,
        createdBy: user2._id,
        status: "todo",
        priority: "high",
        position: 1,
      },
    ]);

    console.log("✅ Created tasks for all projects");
    console.log("\n🎉 Seed data created successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("   Email: mahesh@test.com");
    console.log("   Password: 123456\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
