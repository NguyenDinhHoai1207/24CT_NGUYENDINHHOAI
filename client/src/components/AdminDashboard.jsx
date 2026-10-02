import React, { useState, useEffect } from "react";
import { 
  Pizza as PizzaIcon, ShoppingBag, Plus, Edit3, Trash2, Check, X, 
  TrendingUp, Clock, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Sparkles, Filter 
} from "lucide-react";
import { api } from "../services/api";

export default function AdminDashboard({ onBackToMenu }) {
  const [activeTab, setActiveTab] = useState("pizzas"); // "pizzas", "orders", "stats"
  const [pizzas, setPizzas] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit/Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState(null); // null means adding new
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "classic",
    price: "",
    image: "",
    badge: "",
    spicyLevel: 0,
    isAvailable: true
  });

  const formatPrice = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);
  };

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [pizzasRes, ordersRes, statsRes] = await Promise.all([
        api.getPizzas("all"),
        api.getOrders(),
        api.getStats()
      ]);
      setPizzas(pizzasRes.data?.data || []);
      setOrders(ordersRes.data?.data || []);
      setStats(statsRes.data?.data || null);
    } catch (err) {
      setErrorMsg(err.message || "Không thể tải dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingPizza(null);
    setFormData({
      name: "",
      description: "",
      category: "classic",
      price: "",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      badge: "Mới",
      spicyLevel: 0,
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (pizza) => {
    setEditingPizza(pizza);
    setFormData({
      name: pizza.name,
      description: pizza.description,
      category: pizza.category || "classic",
      price: pizza.price,
      image: pizza.image,
      badge: pizza.badge || "",
      spicyLevel: pizza.spicyLevel || 0,
      isAvailable: pizza.isAvailable !== undefined ? pizza.isAvailable : true
    });
    setIsModalOpen(true);
  };

  // Save Pizza (Create or Update)
  const handleSavePizza = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      alert("Vui lòng điền đủ tên, giá và ảnh bánh");
      return;
    }

    try {
      if (editingPizza) {
        // Update
        const res = await api.updatePizza(editingPizza._id, formData);
        showSuccess(`Đã cập nhật món "${res.data.name}" thành công!`);
      } else {
        // Create
        const res = await api.createPizza(formData);
        showSuccess(`Đã thêm món "${res.data.name}" vào thực đơn!`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || "Lỗi khi lưu thông tin bánh");
    }
  };

  // Delete Pizza
  const handleDeletePizza = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa món "${name}" khỏi thực đơn không?`)) return;
    try {
      await api.deletePizza(id);
      showSuccess(`Đã xóa món "${name}" thành công!`);
      loadData();
    } catch (err) {
      alert(err.message || "Lỗi khi xóa bánh");
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (pizza) => {
    try {
      const updated = !pizza.isAvailable;
      await api.updatePizza(pizza._id, { isAvailable: updated });
      showSuccess(`Đã đổi trạng thái sang: ${updated ? "Còn hàng" : "Hết hàng"}`);
      loadData();
    } catch (err) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      showSuccess("Đã cập nhật trạng thái đơn hàng!");
      loadData();
    } catch (err) {
      alert(err.message || "Lỗi cập nhật trạng thái đơn");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Admin Center
              </span>
              <h1 className="text-2xl font-black text-gray-900">
                Bảng Điều Khiển Quản Trị • 24CT_NguyenDinhHoai
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Thêm, sửa, xóa bánh pizza trong thực đơn và xử lý cập nhật trạng thái đơn hàng trực tuyến
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-all"
              title="Tải lại dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-orange-600" : ""}`} />
            </button>
            <button
              onClick={onBackToMenu}
              className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Về Trang Khách Hàng
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            {errorMsg}
          </div>
        )}

        {/* Stats Summary Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <PizzaIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold">Tổng món trong Menu</span>
                <p className="text-xl font-black text-gray-900">{pizzas.length} bánh</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold">Tổng đơn hàng</span>
                <p className="text-xl font-black text-gray-900">{stats.totalOrders} đơn</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold">Đang xử lý / nướng</span>
                <p className="text-xl font-black text-gray-900">{stats.activeOrders} đơn</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold">Doanh thu hoàn tất</span>
                <p className="text-xl font-black text-green-600">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("pizzas")}
            className={`pb-3 px-6 text-sm font-extrabold transition-all border-b-2 ${
              activeTab === "pizzas"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Quản Lý Thực Đơn Pizza ({pizzas.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-6 text-sm font-extrabold transition-all border-b-2 ${
              activeTab === "orders"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Quản Lý Đơn Đặt Hàng ({orders.length})
          </button>
        </div>

        {/* TAB 1: PIZZA MANAGEMENT */}
        {activeTab === "pizzas" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">Danh sách các món Pizza</h3>
                <p className="text-xs text-gray-500">Bạn có thể thêm mới, sửa giá, sửa mô tả, đổi ảnh hoặc xóa món ăn</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Pizza Mới</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-extrabold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 rounded-l-xl">Món Pizza</th>
                    <th className="py-3.5 px-4">Danh Mục</th>
                    <th className="py-3.5 px-4">Giá Cơ Bản</th>
                    <th className="py-3.5 px-4">Huy Hiệu (Badge)</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4 rounded-r-xl text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pizzas.map((pizza) => (
                    <tr key={pizza._id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <img
                          src={pizza.image}
                          alt={pizza.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="font-extrabold text-gray-900 text-sm">{pizza.name}</p>
                          <p className="text-gray-400 text-[11px] line-clamp-1 max-w-xs">{pizza.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold uppercase text-gray-500">
                        {pizza.category}
                      </td>
                      <td className="py-4 px-4 font-black text-orange-600 text-sm">
                        {formatPrice(pizza.price)}
                      </td>
                      <td className="py-4 px-4">
                        {pizza.badge ? (
                          <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            {pizza.badge}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleAvailability(pizza)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] transition-all ${
                            pizza.isAvailable
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          }`}
                        >
                          {pizza.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {pizza.isAvailable ? "Còn hàng" : "Hết hàng"}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(pizza)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Chỉnh sửa bánh"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePizza(pizza._id, pizza.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Xóa món"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">Danh sách đơn hàng của khách</h3>
              <p className="text-xs text-gray-500">Cập nhật trạng thái từng đơn hàng để khách hàng theo dõi thời gian thực</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-extrabold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 rounded-l-xl">Mã Đơn</th>
                    <th className="py-3.5 px-4">Khách Hàng</th>
                    <th className="py-3.5 px-4">Chi Tiết Món</th>
                    <th className="py-3.5 px-4">Tổng Tiền</th>
                    <th className="py-3.5 px-4">Thanh Toán</th>
                    <th className="py-3.5 px-4">Trạng Thái Đơn</th>
                    <th className="py-3.5 px-4 rounded-r-xl">Cập Nhật Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                        Chưa có đơn hàng nào được đặt.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-4 font-black text-orange-600 text-sm">
                          {ord.orderCode}
                          <span className="block text-[10px] text-gray-400 font-normal">
                            {new Date(ord.createdAt).toLocaleTimeString("vi-VN")}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-extrabold text-gray-900">{ord.customer?.name}</p>
                          <p className="text-gray-500">{ord.customer?.phone}</p>
                          <p className="text-gray-400 text-[11px] max-w-xs truncate">{ord.customer?.address}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-0.5 max-w-xs">
                            {ord.items?.map((item, idx) => (
                              <p key={idx} className="text-gray-800 truncate">
                                <strong>{item.quantity}x</strong> {item.name} ({item.size?.name})
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-black text-gray-900 text-sm">
                          {formatPrice(ord.totalAmount)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="uppercase font-bold text-gray-700 block text-[11px]">
                            {ord.paymentMethod}
                          </span>
                          <span className={`text-[10px] font-bold ${ord.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>
                            {ord.paymentStatus === "paid" ? "Đã thanh toán" : "Chờ thu tiền"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            ord.status === "completed" ? "bg-green-100 text-green-700" :
                            ord.status === "baking" ? "bg-amber-100 text-amber-700" :
                            ord.status === "delivering" ? "bg-blue-100 text-blue-700" :
                            ord.status === "cancelled" ? "bg-red-100 text-red-700" :
                            "bg-purple-100 text-purple-700"
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                          >
                            <option value="pending">pending (Đã nhận)</option>
                            <option value="preparing">preparing (Chuẩn bị)</option>
                            <option value="baking">baking (Nướng bánh)</option>
                            <option value="delivering">delivering (Đang giao)</option>
                            <option value="completed">completed (Hoàn thành)</option>
                            <option value="cancelled">cancelled (Hủy đơn)</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PIZZA ("Có thể chỉnh sửa") */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-orange-600 to-red-600 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black">
                    {editingPizza ? `Chỉnh Sửa: ${editingPizza.name}` : "Thêm Món Pizza Mới"}
                  </h3>
                  <p className="text-xs text-orange-100 mt-0.5">Tùy biến tên, mô tả, giá, ảnh món ăn</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSavePizza} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tên món Pizza *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Pizza Bò Nướng Phô Mai"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Danh mục món *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    >
                      <option value="classic">Truyền Thống (Classic)</option>
                      <option value="seafood">Hải Sản (Seafood)</option>
                      <option value="meat">Thịt Nướng (Meat)</option>
                      <option value="vegetarian">Ăn Chay (Vegetarian)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Giá cơ bản (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="169000"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Đường dẫn hình ảnh (URL) *</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                  {formData.image && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200">
                      <img src={formData.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="text-[11px] text-gray-500">Xem trước hình ảnh bánh</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mô tả món ăn *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả nguyên liệu, hương vị đặc trưng của bánh..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Huy hiệu (Badge nổi bật)</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="VD: Bán Chạy Nhất, Bếp Trưởng..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Độ cay (0 đến 3)</label>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={formData.spicyLevel}
                      onChange={(e) => setFormData({ ...formData, spicyLevel: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-extrabold shadow-md shadow-orange-600/25 active:scale-95 transition-all text-sm"
                  >
                    {editingPizza ? "Lưu Thay Đổi" : "Thêm Món Mới"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
