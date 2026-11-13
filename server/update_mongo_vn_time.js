import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza_24CT_NguyenDinhHoai";

const run = async () => {
  await mongoose.connect(uri);
  const col = mongoose.connection.collection("users");
  const users = await col.find({}).toArray();

  for (const u of users) {
    let d;
    if (u.createdAt instanceof Date) {
      d = u.createdAt;
    } else if (typeof u.createdAt === "string") {
      d = new Date(u.createdAt);
    } else if (u._id && typeof u._id.getTimestamp === "function") {
      d = u._id.getTimestamp();
    } else {
      d = new Date();
    }

    // Convert to Vietnam GMT+7
    const vnTime = new Date(d.getTime() + 7 * 3600 * 1000);
    const vnISO = vnTime.toISOString().replace("Z", "+07:00");
    const vnText = vnTime.toISOString().replace("T", " ").substring(0, 19) + " (Giờ VN)";

    await col.updateOne(
      { _id: u._id },
      {
        $set: {
          createdAtVN: vnISO,
          ngayGioDangKy: vnText
        }
      }
    );
  }

  console.log(`Updated ${users.length} users with createdAtVN and ngayGioDangKy`);
  await mongoose.connection.close();
};

run();
