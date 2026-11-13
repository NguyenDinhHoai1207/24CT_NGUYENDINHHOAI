import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza_24CT_NguyenDinhHoai";

const run = async () => {
  await mongoose.connect(uri);
  const col = mongoose.connection.collection("users");
  const users = await col.find({}).toArray();

  for (const u of users) {
    let d = null;
    if (u.createdAtVN && typeof u.createdAtVN === "string") {
      // e.g. "2026-11-06T08:47:50.244+07:00" -> extract "2026-11-06T08:47:50.244Z"
      const raw = u.createdAtVN.substring(0, 23) + "Z";
      d = new Date(raw);
    } else if (u.createdAt instanceof Date) {
      d = new Date(u.createdAt.getTime() + 7 * 3600 * 1000);
    } else if (typeof u.createdAt === "string" && u.createdAt.includes("T")) {
      const parsed = new Date(u.createdAt);
      d = new Date(parsed.getTime() + 7 * 3600 * 1000);
    }

    if (d && !isNaN(d.getTime())) {
      const vnISO = d.toISOString().replace("Z", "+07:00");
      const vnText = d.toISOString().replace("T", " ").substring(0, 19) + " (Giờ VN)";

      await col.updateOne(
        { _id: u._id },
        {
          $set: {
            createdAt: d,
            updatedAt: d,
            createdAtVN: vnISO,
            ngayGioDangKy: vnText
          }
        }
      );
    }
  }

  console.log(`Updated all ${users.length} users in MongoDB!`);
  await mongoose.connection.close();
};

run();
