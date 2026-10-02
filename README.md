# 🍕 Dự Án Web App Đặt Hàng Pizza Online MERN Stack
## Tác Giả: 24CT_NguyenDinhHoai

Ứng dụng web đặt hàng Pizza trực tuyến được xây dựng hoàn chỉnh theo kiến trúc **MERN Stack** (MongoDB, Express.js, React, Node.js), tích hợp giao diện hiện đại, tối ưu trải nghiệm người dùng và hệ thống quản trị viên (Admin Dashboard) mạnh mẽ với tính năng chỉnh sửa linh hoạt.

---

## 🌟 Các Tính Năng Nổi Bật

### 1. Phía Khách Hàng (Customer Experience)
- **Thực đơn Pizza phong phú**: Phân loại theo danh mục (*Truyền thống, Hải sản sốt Pesto, Thịt nướng BBQ, Món chay rau củ*).
- **Bộ lọc & Tìm kiếm nhanh**: Tìm kiếm theo tên bánh, lọc theo khẩu vị và danh mục.
- **Tùy biến món ăn ("Có thể chỉnh sửa")**:
  - Tùy chọn kích cỡ bánh: Nhỏ (20cm), Vừa (25cm), Lớn (30cm) với giá tự động điều chỉnh.
  - Tùy chọn loại đế: Đế mỏng giòn, Đế dày truyền thống xốp mềm, Đế viền phô mai béo ngậy, Đế viền xúc xích.
  - Thêm topping yêu thích: Thêm phô mai kéo sợi Mozzarella, tôm sú tươi, xúc xích Pepperoni, nấm mỡ tươi, thịt bò băm BBQ,...
  - Ghi chú riêng cho đầu bếp (VD: cắt 8 miếng, ít ớt chuông,...).
- **Giỏ hàng thông minh**: Thêm món, chỉnh sửa số lượng, xóa từng món hoặc xóa tất cả, tự động lưu vào LocalStorage.
- **Mã giảm giá (Voucher)**: Nhập mã `NGUYENDINHHOAI` hoặc `PIZZA20` để giảm ngay **20%** trên tổng hóa đơn.
- **Thanh toán & Đặt hàng**:
  - Giao diện điền thông tin người nhận (Họ tên, SĐT, Địa chỉ, Ghi chú giao hàng).
  - Chọn phương thức: Tiền mặt khi nhận bánh (COD), Chuyển khoản VietQR tiện lợi, Thẻ thanh toán.
- **Theo dõi đơn hàng (Order Tracking)**: Timeline trực quan hiển thị hành trình 5 bước: *Đã nhận đơn -> Chuẩn bị -> Nướng lò củi -> Đang giao -> Hoàn tất*.

### 2. Phía Quản Trị Viên (Admin Dashboard - "Có Thể Chỉnh Sửa")
- **Quản lý Thực đơn Pizza (Full CRUD)**:
  - **Thêm món mới**: Nhập tên, mô tả, giá bán, chọn danh mục, link hình ảnh, độ cay và huy hiệu.
  - **Chỉnh sửa món (Edit)**: Sửa đổi giá, mô tả, ảnh hoặc tên bánh bất cứ lúc nào.
  - **Bật/Tắt trạng thái Còn hàng / Hết hàng**: 1 chạm để chuyển đổi.
  - **Xóa món**: Xóa pizza khỏi menu khi không còn kinh doanh.
- **Quản lý Đơn hàng (Orders Management)**:
  - Xem danh sách toàn bộ các đơn hàng mới nhất từ khách hàng.
  - Cập nhật trạng thái đơn (*pending -> preparing -> baking -> delivering -> completed -> cancelled*).
- **Báo cáo Thống kê**:
  - Tổng số món pizza trong thực đơn.
  - Tổng số đơn hàng và đơn đang xử lý.
  - Doanh thu thực tế của các đơn đã hoàn tất.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend**:
  - React 18
  - Vite (Siêu nhanh, tối ưu hóa build)
  - Tailwind CSS (Thiết kế giao diện đẹp mắt, responsive đa thiết bị)
  - Lucide React Icons (Bộ biểu tượng hiện đại)
- **Backend**:
  - Node.js & Express.js
  - RESTful API Architecture
  - CORS, Dotenv, Morgan Logger
- **Database**:
  - MongoDB & Mongoose ODM
  - Tích hợp sẵn cơ chế **Dual-Mode Persistence (Fallback Store)**: Tự động lưu trữ dữ liệu bền vững tại `server/data/db.json` nếu máy chưa cài MongoDB cục bộ, giúp bạn chạy thử nghiệm và chấm điểm ngay lập tức mà không cần cài đặt thêm phần mềm! Khi có MongoDB Atlas hoặc Local, chỉ cần điền chuỗi kết nối vào file `server/.env`.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu Cầu
- Đã cài đặt **Node.js** (khuyến nghị phiên bản 18+ trở lên).

### Bước 1: Mở thư mục dự án
```powershell
cd 24CT_NguyenDinhHoai
```

### Bước 2: Cài đặt thư viện (Dependencies)
```powershell
# Cài đặt cho Backend
cd server
npm.cmd install

# Cài đặt cho Frontend
cd ../client
npm.cmd install
cd ..
```

### Bước 3: Khởi tạo dữ liệu mẫu (Seeding)
```powershell
cd server
npm.cmd run seed
cd ..
```

### Bước 4: Khởi chạy ứng dụng

**Cách 1: Chạy song song 2 terminal**

- **Terminal 1 (Backend Server)**:
  ```powershell
  cd server
  npm.cmd run dev
  ```
  *(Server sẽ chạy tại: http://localhost:5000)*

- **Terminal 2 (Frontend Client)**:
  ```powershell
  cd client
  npm.cmd run dev
  ```
  *(Client sẽ chạy tại: http://localhost:5173)*

Mở trình duyệt truy cập: **http://localhost:5173** để trải nghiệm!

---

## 📡 Danh Sách API Endpoints (Backend)

| Method | Endpoint | Mô Tả |
|---|---|---|
| `GET` | `/api/pizzas` | Lấy danh sách pizza (có lọc & tìm kiếm) |
| `GET` | `/api/pizzas/:id` | Lấy chi tiết một món pizza |
| `POST` | `/api/pizzas` | Thêm pizza mới (Admin) |
| `PUT` | `/api/pizzas/:id` | Chỉnh sửa thông tin pizza (Admin) |
| `DELETE` | `/api/pizzas/:id` | Xóa món pizza (Admin) |
| `POST` | `/api/orders` | Tạo đơn đặt hàng mới |
| `GET` | `/api/orders` | Lấy danh sách tất cả đơn hàng (Admin) |
| `GET` | `/api/orders/:id` | Tra cứu đơn hàng theo mã (Order Tracking) |
| `PATCH` | `/api/orders/:id/status` | Cập nhật trạng thái đơn (Admin) |
| `GET` | `/api/orders/stats/summary` | Thống kê doanh thu & đơn hàng |
| `GET` | `/api/health` | Kiểm tra trạng thái máy chủ & chế độ DB |

---
**Chúc bạn thực hiện đồ án thành công rực rỡ! 🍕✨**
