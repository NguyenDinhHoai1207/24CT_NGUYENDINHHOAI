import mongoose from "mongoose";

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza_24CT_NguyenDinhHoai";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB đã kết nối thành công: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ Không thể kết nối MongoDB cục bộ (${error.message}).`);
    console.log(`ℹ️ Kích hoạt chế độ Persistent Store (dữ liệu lưu tại server/data/db.json).`);
    console.log(`💡 Để dùng MongoDB, bạn chỉ cần điền chuỗi MONGODB_URI trong file server/.env`);
  }
};

export const isDatabaseConnected = () => isMongoConnected && mongoose.connection.readyState === 1;
