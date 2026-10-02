import dotenv from "dotenv";
import mongoose from "mongoose";
import Pizza from "../models/Pizza.js";
import { samplePizzas } from "./samplePizzas.js";
import { saveStoreData } from "./store.js";

dotenv.config();

const seedData = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza_24CT_NguyenDinhHoai";
  
  // Seed local persistent store first
  const storeData = {
    pizzas: samplePizzas.map((p, idx) => ({
      ...p,
      _id: `pizza_${Date.now()}_${idx + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    orders: []
  };
  saveStoreData(storeData);
  console.log("✅ Đã khởi tạo dữ liệu mẫu cho Local Store (server/data/db.json)!");

  // Try seed to MongoDB if connected
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`✅ Đã kết nối MongoDB: ${conn.connection.host}`);
    
    await Pizza.deleteMany();
    await Pizza.insertMany(samplePizzas);
    console.log("✅ Đã nạp thành công các món Pizza vào MongoDB!");
    await mongoose.connection.close();
  } catch (err) {
    console.log("ℹ️ MongoDB cục bộ chưa chạy, dữ liệu đã sẵn sàng trong Local Store.");
  }
  
  process.exit(0);
};

seedData();
