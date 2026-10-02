import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza_24CT_NguyenDinhHoai";

const run = async () => {
  try {
    const file = path.join(process.cwd(), "server", "data", "db.json");
    if (!fs.existsSync(file)) {
      console.error("Cannot find server/data/db.json");
      process.exit(1);
    }

    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    const users = data.users || [];
    if (users.length === 0) {
      console.log("No users found in db.json to import.");
      process.exit(0);
    }

    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB:", conn.connection.host);

    // Use raw collection operations to preserve existing _id and timestamps
    const col = mongoose.connection.collection("users");
    await col.deleteMany({});
    const res = await col.insertMany(users);
    console.log(`Imported ${res.insertedCount} users into MongoDB.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Import failed:", err.message || err);
    process.exit(1);
  }
};

run();
