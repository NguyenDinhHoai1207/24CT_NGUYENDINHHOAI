import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Xuất thông tin tài khoản người dùng ra file PDF
 * @param {Object} user - Thông tin người dùng
 */
export const exportUserProfilePDF = (user) => {
  const doc = new jsPDF();

  // --- Tiêu đề ---
  doc.setFillColor(249, 115, 22); // Orange
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PIZZA DELUXE", 14, 14);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("24CT_NguyenDinhHoai - He thong dat pizza truc tuyen", 14, 22);
  doc.text("Website: localhost:5173", 14, 29);

  // --- Tên tài liệu ---
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("THONG TIN TAI KHOAN NGUOI DUNG", 14, 50);

  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(0.8);
  doc.line(14, 53, 196, 53);

  // --- Thông tin chi tiết ---
  const labelX = 14;
  const valueX = 75;
  let y = 65;
  const lineH = 10;

  const roleLabel = user.role === "admin" ? "Quan tri vien (Admin)" : (user.role === "staff" ? "Nhan vien (Staff)" : "Khach hang (Customer)");

  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
    : new Date().toLocaleDateString("vi-VN");

  const fields = [
    ["Ho va ten:", user.name || "---"],
    ["Email:", user.email || "---"],
    ["So dien thoai:", user.phone || "---"],
    ["Dia chi giao hang:", user.address || "---"],
    ["Vai tro:", roleLabel],
    ["Ngay gio dang ky:", createdDate],
  ];

  doc.setFontSize(11);
  fields.forEach(([label, value]) => {
    // Label
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(label, labelX, y);

    // Value
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(String(value), valueX, y);

    // Divider line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(14, y + 3, 196, y + 3);

    y += lineH;
  });

  // --- Footer ---
  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(245, 245, 245);
  doc.rect(0, pageH - 20, 210, 20, "F");

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Tai lieu duoc xuat tu he thong Pizza Deluxe - 24CT_NguyenDinhHoai | " +
      new Date().toLocaleString("vi-VN"),
    14,
    pageH - 8
  );

  // --- Lưu file ---
  const fileName = `TaiKhoan_${(user.name || "user").replace(/\s+/g, "_")}_${Date.now()}.pdf`;
  doc.save(fileName);
};