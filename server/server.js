import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB, isDatabaseConnected } from "./config/db.js";
import pizzaRoutes from "./routes/pizzaRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { getStoreData } from "./data/store.js";

dotenv.config();

// Khởi tạo Express
const app = express();

// Kết nối Cơ sở dữ liệu
connectDB();

// Đảm bảo dữ liệu khởi đầu đã sẵn sàng
getStoreData();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Tuyến đường API (Routes)
app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "24CT_NguyenDinhHoai Pizza API đang hoạt động bình thường!",
    dbMode: isDatabaseConnected() ? "MongoDB Database" : "Local Persistent JSON Store",
    timestamp: new Date().toISOString()
  });
});

// Xử lý Route không tồn tại
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy đường dẫn: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Lỗi Server:", err.stack);
  res.status(500).json({
    success: false,
    message: "Đã xảy ra sự cố nội bộ máy chủ!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 24CT_NguyenDinhHoai Server đang chạy tại http://localhost:${PORT}`);
  console.log(`🍕 API Pizzas: http://localhost:${PORT}/api/pizzas`);
  console.log(`📦 API Orders: http://localhost:${PORT}/api/orders`);
});
