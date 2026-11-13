import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "data", "db.json");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza_24CT_NguyenDinhHoai";

const run = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("staff123", salt);

  const staffUser = {
    _id: "user_staff_01",
    name: "Nguyễn Văn Nam (Nhân Viên)",
    email: "nhanvien@pizza.vn",
    password: hashedPassword,
    phone: "0909888777",
    address: "Bếp Pizza Deluxe, 246 Nút Thành",
    role: "staff",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdAtVN: "2026-11-13T09:30:00.000+07:00",
    ngayGioDangKy: "2026-11-13 09:30:00 (Giờ VN)"
  };

  // 1. Add to MongoDB
  try {
    await mongoose.connect(uri);
    const col = mongoose.connection.collection("users");
    const exists = await col.findOne({ email: "nhanvien@pizza.vn" });
    if (!exists) {
      await col.insertOne(staffUser);
      console.log("Added staff user to MongoDB!");
    } else {
      await col.updateOne({ email: "nhanvien@pizza.vn" }, { $set: { role: "staff" } });
      console.log("Updated staff user in MongoDB!");
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error("MongoDB error:", err.message);
  }

  // 2. Add to db.json
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      const db = JSON.parse(raw);
      db.users = db.users || [];
      const idx = db.users.findIndex(u => u.email === "nhanvien@pizza.vn");
      if (idx === -1) {
        db.users.push({
          ...staffUser,
          createdAt: "2026-11-13T09:30:00.000+07:00",
          updatedAt: "2026-11-13T09:30:00.000+07:00"
        });
      } else {
        db.users[idx].role = "staff";
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
      console.log("Added staff user to db.json!");
    }
  } catch (err) {
    console.error("db.json error:", err.message);
  }
};

run();
