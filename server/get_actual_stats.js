import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza_24CT_NguyenDinhHoai";

const run = async () => {
  await mongoose.connect(uri);
  const uCol = mongoose.connection.collection("users");
  const pCol = mongoose.connection.collection("pizzas");
  const oCol = mongoose.connection.collection("orders");

  // 1. Roles
  const roles = await uCol.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]).toArray();
  const totalUsers = await uCol.countDocuments();
  console.log("=== NHAN THUC 4: ROLES ===");
  console.log("Total Users:", totalUsers);
  console.log("Roles breakdown:", JSON.stringify(roles, null, 2));

  // 2. Pizzas count & categories
  const totalPizzas = await pCol.countDocuments();
  const categories = await pCol.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 }, avgPrice: { $avg: "$price" } } }
  ]).toArray();
  console.log("=== NHAN THUC 5: PRODUCTS & REVENUE ===");
  console.log("Total Pizzas:", totalPizzas);
  console.log("Categories:", JSON.stringify(categories, null, 2));

  // 3. Orders & Revenue
  const totalOrders = await oCol.countDocuments();
  const rev = await oCol.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
  ]).toArray();
  console.log("Total Orders:", totalOrders);
  console.log("Total Revenue:", JSON.stringify(rev, null, 2));

  await mongoose.connection.close();
};

run();
