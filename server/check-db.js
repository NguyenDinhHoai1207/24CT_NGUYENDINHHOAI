import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza_24CT_NguyenDinhHoai";

const checkMongoDB = async () => {
  console.log("==================================================");
  console.log("   KIỂM TRA CƠ SỞ DỮ LIỆU MONGODB PIZZA DELUXE    ");
  console.log("==================================================");
  console.log("📡 Đang kết nối tới URI:", uri);

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`✅ Kết nối thành công tới Host: ${conn.connection.host}`);
    console.log(`📂 Database đang sử dụng: [ ${conn.connection.name} ]`);
    console.log("--------------------------------------------------");

    // 1. Danh sách collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("📋 Các Collections hiện có:");
    for (const c of collections) {
      const count = await conn.connection.collection(c.name).countDocuments();
      console.log(`   • ${c.name.padEnd(12)} : ${count} bản ghi (documents)`);
    }

    console.log("--------------------------------------------------");

    // 2. Chi tiết Users
    console.log("👥 DANH SÁCH TÀI KHOẢN NGƯỜI DÙNG (USERS):");
    const users = await conn.connection.collection("users").find({}).toArray();
    if (users.length === 0) {
      console.log("   (Chưa có tài khoản nào)");
    } else {
      users.forEach((u, i) => {
        console.log(`   ${i + 1}. [${u.role || "customer"}] ${u.name} | ${u.email} | Ngày tạo: ${u.createdAt}`);
      });
    }

    console.log("--------------------------------------------------");

    // 3. Chi tiết Pizzas
    console.log("🍕 DANH SÁCH MÓN PIZZA:");
    const pizzas = await conn.connection.collection("pizzas").find({}).toArray();
    pizzas.slice(0, 5).forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} - Giá: ${p.price?.toLocaleString("vi-VN")}đ [${p.category}]`);
    });
    if (pizzas.length > 5) {
      console.log(`   ... và ${pizzas.length - 5} món khác.`);
    }

    console.log("==================================================");
    console.log("✅ KIỂM TRA HOÀN TẤT - MONGODB ĐANG HOẠT ĐỘNG TỐT!");
    console.log("==================================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Không thể kết nối tới MongoDB!");
    console.error("Chi tiết lỗi:", err.message);
    process.exit(1);
  }
};

checkMongoDB();
