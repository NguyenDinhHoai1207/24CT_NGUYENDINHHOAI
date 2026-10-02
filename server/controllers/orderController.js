import Order from "../models/Order.js";
import { isDatabaseConnected } from "../config/db.js";
import { Store } from "../data/store.js";

// Helper to generate readable Order Code
const generateOrderCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PIZZA-";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { customer, items, subtotal, shippingFee, discount, totalAmount, paymentMethod } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ success: false, message: "Vui lòng cung cấp đầy đủ thông tin giao hàng (Tên, SĐT, Địa chỉ)" });
    }

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: "Giỏ hàng đang trống, vui lòng chọn ít nhất 1 món pizza" });
    }

    const orderData = {
      orderCode: generateOrderCode(),
      customer,
      items,
      subtotal: Number(subtotal) || 0,
      shippingFee: shippingFee !== undefined ? Number(shippingFee) : 20000,
      discount: Number(discount) || 0,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "paid",
      status: "pending"
    };

    let newOrder;
    if (isDatabaseConnected()) {
      newOrder = await Order.create(orderData);
    } else {
      newOrder = await Store.createOrder(orderData);
    }

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công! Đơn hàng của bạn đang được chuẩn bị.",
      data: newOrder
    });
  } catch (error) {
    console.error("Lỗi createOrder:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi tạo đơn hàng", error: error.message });
  }
};

// @desc    Lấy danh sách tất cả đơn hàng (Admin)
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    let orders;
    if (isDatabaseConnected()) {
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      orders = await Store.findOrders();
    }
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Lỗi getOrders:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi tải danh sách đơn hàng", error: error.message });
  }
};

// @desc    Lấy chi tiết đơn hàng theo orderCode hoặc ID (Dành cho khách tra cứu)
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order;

    if (isDatabaseConnected()) {
      order = await Order.findOne({ $or: [{ _id: id }, { orderCode: id }] });
    } else {
      order = await Store.findOrderById(id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng với mã này" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Lỗi getOrderById:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi tra cứu đơn hàng", error: error.message });
  }
};

// @desc    Cập nhật trạng thái đơn hàng (Admin)
// @route   PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "preparing", "baking", "delivering", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Trạng thái đơn hàng không hợp lệ" });
    }

    let updatedOrder;
    if (isDatabaseConnected()) {
      updatedOrder = await Order.findOneAndUpdate(
        { $or: [{ _id: id }, { orderCode: id }] },
        { status },
        { new: true }
      );
    } else {
      updatedOrder = await Store.updateOrderStatus(id, status);
    }

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng để cập nhật" });
    }

    res.json({ success: true, message: `Đã cập nhật trạng thái đơn hàng sang: ${status}`, data: updatedOrder });
  } catch (error) {
    console.error("Lỗi updateOrderStatus:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi cập nhật trạng thái đơn", error: error.message });
  }
};

// @desc    Thống kê tổng quan cho Admin
// @route   GET /api/orders/stats/summary
export const getOrderStats = async (req, res) => {
  try {
    let orders;
    if (isDatabaseConnected()) {
      orders = await Order.find();
    } else {
      orders = await Store.findOrders();
    }

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.status === "completed")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeOrders = orders.filter(o => ["pending", "preparing", "baking", "delivering"].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === "completed").length;

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        activeOrders,
        completedOrders
      }
    });
  } catch (error) {
    console.error("Lỗi getOrderStats:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi lấy thống kê", error: error.message });
  }
};
