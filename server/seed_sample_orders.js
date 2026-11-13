import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza_24CT_NguyenDinhHoai";

const sampleOrders = [
  {
    orderCode: "PIZZA-HD01",
    customer: { name: "Nguyễn Đình Hoài", phone: "0941246680", address: "246 NÚT THÀNH" },
    items: [
      { name: "Pizza Hải Sản Sốt Pesto Thượng Hạng", size: "M", price: 219000, quantity: 1 }
    ],
    totalAmount: 239000,
    paymentMethod: "banking",
    paymentStatus: "paid",
    status: "completed",
    createdAt: new Date("2026-11-06T08:15:00.000Z"),
    createdAtVN: "2026-11-06T08:15:00.000+07:00",
    ngayGioDangKy: "2026-11-06 08:15:00 (Giờ VN)"
  },
  {
    orderCode: "PIZZA-HD02",
    customer: { name: "Lê Tấn Phát", phone: "0976333444", address: "33 Hùng Vương" },
    items: [
      { name: "Pizza Bò Nướng BBQ Phô Mai", size: "L", price: 229000, quantity: 1 },
      { name: "Pizza Pepperoni Mỹ Cổ Điển", size: "S", price: 159000, quantity: 1 }
    ],
    totalAmount: 408000,
    paymentMethod: "cod",
    paymentStatus: "paid",
    status: "completed",
    createdAt: new Date("2026-11-06T08:48:00.000Z"),
    createdAtVN: "2026-11-06T08:48:00.000+07:00",
    ngayGioDangKy: "2026-11-06 08:48:00 (Giờ VN)"
  },
  {
    orderCode: "PIZZA-HD03",
    customer: { name: "Lê Đình Lý", phone: "0932444999", address: "12 Nại Nam" },
    items: [
      { name: "Pizza 4 Loại Phô Mai Hoàng Gia", size: "M", price: 199000, quantity: 1 }
    ],
    totalAmount: 219000,
    paymentMethod: "cod",
    paymentStatus: "paid",
    status: "completed",
    createdAt: new Date("2026-11-06T08:50:00.000Z"),
    createdAtVN: "2026-11-06T08:50:00.000+07:00",
    ngayGioDangKy: "2026-11-06 08:50:00 (Giờ VN)"
  },
  {
    orderCode: "PIZZA-HD04",
    customer: { name: "Nguyễn Đình Hoài", phone: "0987654321", address: "Đại Học CNTT" },
    items: [
      { name: "Pizza Gà Nướng Phô Mai Nấm Cay", size: "M", price: 195000, quantity: 2 }
    ],
    totalAmount: 410000,
    paymentMethod: "banking",
    paymentStatus: "paid",
    status: "completed",
    createdAt: new Date("2026-11-06T09:10:00.000Z"),
    createdAtVN: "2026-11-06T09:10:00.000+07:00",
    ngayGioDangKy: "2026-11-06 09:10:00 (Giờ VN)"
  },
  {
    orderCode: "PIZZA-HD05",
    customer: { name: "Trần Thị Mai", phone: "0912345678", address: "15 Quang Trung" },
    items: [
      { name: "Pizza Rau Củ Chay", size: "S", price: 149000, quantity: 1 }
    ],
    totalAmount: 169000,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    status: "delivering",
    createdAt: new Date("2026-11-13T08:00:00.000Z"),
    createdAtVN: "2026-11-13T08:00:00.000+07:00",
    ngayGioDangKy: "2026-11-13 08:00:00 (Giờ VN)"
  }
];

const seedOrders = async () => {
  await mongoose.connect(uri);
  const col = mongoose.connection.collection("orders");
  await col.deleteMany({});
  await col.insertMany(sampleOrders);
  console.log(`Seeded ${sampleOrders.length} sample orders to MongoDB!`);
  await mongoose.connection.close();
};

seedOrders();
