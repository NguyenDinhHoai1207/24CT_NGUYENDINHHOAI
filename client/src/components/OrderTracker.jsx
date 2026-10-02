import React, { useState, useEffect } from "react";
import { X, Search, Clock, ChefHat, Flame, Truck, CheckCircle, Package } from "lucide-react";
import { api } from "../services/api";

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " - " + d.toLocaleDateString("vi-VN");
};

const STATUS_STEPS = [
  { id: "pending", label: "Đã nhận đơn", icon: Clock, desc: "Cửa hàng đã ghi nhận đơn đặt hàng" },
  { id: "preparing", label: "Chuẩn bị", icon: ChefHat, desc: "Đầu bếp đang nhào bột & cho topping" },
  { id: "baking", label: "Đang nướng", icon: Flame, desc: "Bánh đang được nướng vàng giòn trong lò" },
  { id: "delivering", label: "Đang giao", icon: Truck, desc: "Shipper đang giao nóng hổi tới bạn" },
  { id: "completed", label: "Hoàn tất", icon: CheckCircle, desc: "Đã giao thành công! Chúc ngon miệng" }
];

export default function OrderTracker({ isOpen, onClose, initialOrder }) {
  const [searchCode, setSearchCode] = useState("");
  const [order, setOrder] = useState(initialOrder || null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setOrder(initialOrder);
      if (initialOrder) {
        setSearchCode(initialOrder.orderCode || initialOrder._id);
        setErrorMsg("");
      }
    }
  }, [isOpen, initialOrder]);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchCode.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.getOrderById(searchCode.trim());
      setOrder(res.data?.data || res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Không tìm thấy đơn hàng với mã này!");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const currentStatusIndex = order 
    ? STATUS_STEPS.findIndex(s => s.id === order.status)
    : -1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-lg font-black tracking-tight">Theo dõi tiến độ đơn hàng</h2>
            <p className="text-xs text-orange-100 mt-0.5">Cập nhật hành trình đơn hàng bánh giao tận tay</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
            <input 
              type="text" 
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="NHẬP MÃ ĐƠN HÀNG (VD: PIZZA-A1B2C)"
              className="w-full pl-11 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 rounded-xl shadow transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {loading ? "Đang tìm..." : "Tra cứu"}
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-sm font-bold text-center mb-6 animate-shake">
              {errorMsg}
            </div>
          )}

          {!order && !loading && !errorMsg && (
            <div className="py-12 text-center text-gray-400 space-y-3">
              <Package className="w-12 h-12 mx-auto opacity-20" />
              <p className="text-sm font-medium">Nhập mã đơn hàng của bạn vào ô bên trên để kiểm tra</p>
            </div>
          )}

          {order && (
            <div className="space-y-6 animate-fadeInUp">
              
              {/* Order Brief Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Mã Đơn hàng:</p>
                  <p className="font-black text-orange-600">{order.orderCode || order._id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Thời gian đặt:</p>
                  <p className="font-bold text-gray-800 text-sm">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Tổng thanh toán:</p>
                  <p className="font-black text-gray-900">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 text-sm">Trạng thái xử lý:</h3>
                <div className="relative pl-6 space-y-6">
                  {/* Vertical Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStatusIndex;
                    const isCurrent = idx === currentStatusIndex;
                    const isPending = idx > currentStatusIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.id} className="relative flex items-start gap-4">
                        {/* Dot */}
                        <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                          isCompleted ? "border-green-500" : 
                          isCurrent ? "border-orange-500 ring-4 ring-orange-500/20" : 
                          "border-gray-200"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          ) : isCurrent ? (
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                          ) : null}
                        </div>

                        {/* Text */}
                        <div className={`flex-1 pt-0.5 ${isPending ? 'opacity-40' : ''}`}>
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${
                              isCurrent ? "bg-orange-100 text-orange-600" : 
                              isCompleted ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <h4 className={`font-bold text-sm ${isCurrent ? 'text-orange-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                              {step.label} {isCurrent && <span className="text-[10px] bg-orange-100 px-1.5 py-0.5 rounded text-orange-600 ml-1 animate-pulse">Đang xử lý</span>}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Chi tiết món:</h3>
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div>
                        <span className="font-bold text-gray-900">{item.quantity}x {item.name}</span>
                        <div className="text-[11px] text-gray-500">
                          {item.size?.name} • {item.crust?.name}
                          {item.toppings?.length > 0 && ` • Topping: ${item.toppings.map(t => t.name).join(", ")}`}
                        </div>
                      </div>
                      <span className="font-black text-gray-800">{formatPrice(item.totalItemPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="border-t border-gray-100 pt-4 text-xs text-gray-600 space-y-1">
                <p><span className="font-bold text-gray-800">Người nhận:</span> {order.customer?.name} ({order.customer?.phone})</p>
                <p><span className="font-bold text-gray-800">Địa chỉ giao:</span> {order.customer?.address}</p>
                {order.customer?.note && <p><span className="font-bold text-gray-800">Ghi chú:</span> {order.customer?.note}</p>}
                <p><span className="font-bold text-gray-800">Hình thức thanh toán:</span> {order.paymentMethod?.toUpperCase()} ({order.paymentStatus === "paid" ? "Đã thanh toán" : "Thanh toán khi nhận"})</p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}