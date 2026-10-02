import React, { useState, useEffect } from "react";
import { X, Search, CheckCircle2, Clock, ChefHat, Flame, Truck, Check, AlertTriangle, ArrowRight } from "lucide-react";
import { api } from "../services/api";

const STATUS_STEPS = [
  { key: "pending", label: "Đã nhận đơn", icon: Clock, desc: "Cửa hàng đã ghi nhận đơn đặt hàng" },
  { key: "preparing", label: "Chuẩn bị", icon: ChefHat, desc: "Đầu bếp đang nhào bột & cho topping" },
  { key: "baking", label: "Nướng lò củi", icon: Flame, desc: "Bánh đang được nướng vàng giòn trong lò" },
  { key: "delivering", label: "Đang giao", icon: Truck, desc: "Shipper đang giao nóng hổi tới bạn" },
  { key: "completed", label: "Hoàn tất", icon: CheckCircle2, desc: "Đã giao thành công! Chúc ngon miệng" }
];

export default function OrderTracker({ isOpen, onClose, initialOrder }) {
  const [order, setOrder] = useState(initialOrder || null);
  const [searchCode, setSearchCode] = useState(initialOrder?.orderCode || "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
      setSearchCode(initialOrder.orderCode);
    }
  }, [initialOrder]);

  if (!isOpen) return null;

  const formatPrice = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.getOrderById(searchCode.trim());
      setOrder(res.data);
    } catch (err) {
      setErrorMsg(err.message || "Không tìm thấy đơn hàng với mã này!");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    if (order.status === "cancelled") return -1;
    const idx = STATUS_STEPS.findIndex(s => s.key === order.status);
    return idx >= 0 ? idx : 0;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-black">Theo dõi tiến độ đơn hàng</h2>
            <p className="text-xs text-orange-100 mt-0.5">Cập nhật hành trình làm bánh và giao hàng trực tiếp</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Nhập mã đơn hàng (VD: PIZZA-A1B2C)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md shadow-orange-600/20 active:scale-95"
            >
              {loading ? "Đang tìm..." : "Tra cứu"}
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              {errorMsg}
            </div>
          )}

          {order && (
            <div className="space-y-6">
              
              {/* Order Info Card */}
              <div className="p-4 sm:p-5 bg-orange-50/50 rounded-2xl border border-orange-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Mã đơn hàng:</span>
                  <span className="text-lg font-black text-orange-600 tracking-wider">
                    {order.orderCode}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Thời gian đặt:</span>
                  <span className="text-xs font-bold text-gray-800">
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN")} - {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Tổng thanh toán:</span>
                  <span className="text-base font-black text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              {order.status === "cancelled" ? (
                <div className="p-4 bg-red-100 text-red-800 rounded-2xl text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Đơn hàng này đã bị hủy!
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <h4 className="font-extrabold text-gray-900 text-sm">Trạng thái xử lý:</h4>
                  
                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                    {STATUS_STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isPast = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={step.key} className="relative flex items-start gap-4">
                          {/* Dot / Icon */}
                          <div
                            className={`absolute -left-6 sm:-left-8 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                              isCurrent
                                ? "bg-orange-600 text-white ring-4 ring-orange-100 shadow-md scale-110"
                                : isPast
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          </div>

                          {/* Text */}
                          <div className="pt-0.5">
                            <h5
                              className={`text-sm font-black flex items-center gap-2 ${
                                isCurrent ? "text-orange-600" : isPast ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {step.label}
                              {isCurrent && (
                                <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                                  Đang thực hiện
                                </span>
                              )}
                            </h5>
                            <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items in order */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <h4 className="font-extrabold text-gray-900 text-sm">Chi tiết món đã đặt:</h4>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
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
