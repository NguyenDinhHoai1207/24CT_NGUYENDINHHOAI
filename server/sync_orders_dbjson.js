import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "data", "db.json");

const raw = fs.readFileSync(DB_FILE, "utf8");
const db = JSON.parse(raw);

const sampleOrders = [
  {
    _id: "ord_01",
    orderCode: "PIZZA-HD01",
    customer: { name: "Nguyễn Đình Hoài", phone: "0941246680", address: "246 NÚT THÀNH" },
    items: [
      { name: "Pizza Hải Sản Sốt Pesto Thượng Hạng", size: "M", price: 219000, quantity: 1 }
    ],
    totalAmount: 239000,
    paymentMethod: "banking",
    paymentStatus: "paid",
    status: "completed",
    createdAt: "2026-11-06T08:15:00.000+07:00",
    createdAtVN: "2026-11-06T08:15:00.000+07:00",
    ngayGioDangKy: "2026-11-06 08:15:00 (Giờ VN)"
  },
  {
    _id: "ord_02",
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
    createdAt: "2026-11-06T08:48:00.000+07:00",
    createdAtVN: "2026-11-06T08:48:00.000+07:00",
    ngayGioDangKy: "2026-11-06 08:48:00 (Giờ VN)"
  },
  {
    _id: "ord_03",
    orderCode: "PIZZA-HD03",
    customer: { name: "Lê Đình Lý", phone: "0932444999", address: "12 Nại Nam" },
    items: [
      { name: "Pizza 4 Loại Phô Mai Hoàng Gia", size: "M", price: 199000, quantity: 1 }
    ],
    totalAmount: 219000,
    paymentMethod: "cod",
    paymentStatus: "paid",
    status: "completed",
    createdAt: "2026-11-06T08:50:00.000+07:00",
    createdAtVN: "2026-11-06T08:50:00.000+07:00",
    ngayGioDangKy: "2026-11-06 08:50:00 (Giờ VN)"
  },
  {
    _id: "ord_04",
    orderCode: "PIZZA-HD04",
    customer: { name: "Nguyễn Đình Hoài", phone: "0987654321", address: "Đại Học CNTT" },
    items: [
      { name: "Pizza Gà Nướng Phô Mai Nấm Cay", size: "M", price: 195000, quantity: 2 }
    ],
    totalAmount: 410000,
    paymentMethod: "banking",
    paymentStatus: "paid",
    status: "completed",
    createdAt: "2026-11-06T09:10:00.000+07:00",
    createdAtVN: "2026-11-06T09:10:00.000+07:00",
    ngayGioDangKy: "2026-11-06 09:10:00 (Giờ VN)"
  },
  {
    _id: "ord_05",
    orderCode: "PIZZA-HD05",
    customer: { name: "Trần Thị Mai", phone: "0912345678", address: "15 Quang Trung" },
    items: [
      { name: "Pizza Rau Củ Chay", size: "S", price: 149000, quantity: 1 }
    ],
    totalAmount: 169000,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    status: "delivering",
    createdAt: "2026-11-13T08:00:00.000+07:00",
    createdAtVN: "2026-11-13T08:00:00.000+07:00",
    ngayGioDangKy: "2026-11-13 08:00:00 (Giờ VN)"
  }
];

db.orders = sampleOrders;
fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
console.log(`Synced ${sampleOrders.length} orders into server/data/db.json!`);
