import React, { useState, useEffect } from "react";
import { X, CheckCircle, CreditCard, Banknote, QrCode, MapPin, User, Phone, FileText, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

export default function CheckoutModal({ isOpen, onClose, onOrderSuccess, user }) {
  const { cart, subtotal, shippingFee, discountAmount, totalAmount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!user || !isOpen) return;

    setFormData((prev) => ({
      ...prev,
      name: user.name || prev.name || "",
      phone: user.phone || prev.phone || "",
      address: user.address || prev.address || ""
    }));
  }, [isOpen, user]);

  if (!isOpen) return null;

  const formatPrice = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          note: formData.note.trim()
        },
        items: cart.map(item => ({
          pizzaId: item.pizzaId,
          name: item.name,
          image: item.image,
          size: item.size,
          crust: item.crust,
          toppings: item.toppings,
          itemPrice: item.unitPrice,
          quantity: item.quantity,
          totalItemPrice: item.totalItemPrice,
          specialInstructions: item.specialInstructions
        })),
        subtotal,
        shippingFee,
        discount: discountAmount,
        totalAmount,
        paymentMethod
      };

      const response = await api.createOrder(orderPayload);
      clearCart();
      onClose();
      onOrderSuccess(response.data);
    } catch (err) {
      setErrorMsg(err.message || "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-orange-600 to-red-600 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-black">Xác nhận đặt hàng & Thanh toán</h2>
            <p className="text-xs text-orange-100 mt-0.5">Dự án 24CT_NguyenDinhHoai Pizza Deluxe</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Thông tin giao hàng */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-black">1</span>
              Thông tin nhận hàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" /> Họ và tên khách hàng *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="VD: Nguyễn Đình Hoài"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> Số điện thoại nhận hàng *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="VD: 0987654321"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> Địa chỉ giao hàng chi tiết *
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="VD: Số 24 Đường Đại Học, Phường Linh Trung, TP. Thủ Đức"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-gray-400" /> Ghi chú cho tài xế giao hàng
              </label>
              <input
                type="text"
                name="note"
                placeholder="VD: Gọi điện trước khi giao, để ở cổng bảo vệ..."
                value={formData.note}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Section 2: Hình thức thanh toán */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-black">2</span>
              Phương thức thanh toán
            </h3>

            <div className="space-y-2">
              {/* COD */}
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === "cod"
                    ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-sm">Thanh toán tiền mặt khi nhận bánh (COD)</span>
                    <span className="text-xs text-gray-500">Nhận bánh nóng hổi rồi mới thanh toán cho shipper</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
              </label>

              {/* Banking QR Code */}
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === "banking"
                    ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-sm">Chuyển khoản Ngân hàng / VietQR</span>
                    <span className="text-xs text-gray-500">Quét mã QR tiện lợi qua mọi ứng dụng ngân hàng</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="banking"
                  checked={paymentMethod === "banking"}
                  onChange={() => setPaymentMethod("banking")}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
              </label>

              {/* Card */}
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === "card"
                    ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-sm">Thẻ Quốc tế (Visa / Master / JCB)</span>
                    <span className="text-xs text-gray-500">Cổng thanh toán bảo mật 256-bit</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
              </label>
            </div>

            {/* QR Mock Box if banking is selected */}
            {paymentMethod === "banking" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-2 animate-fadeIn">
                <p className="font-bold flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-blue-600" /> Thông tin tài khoản nhận:
                </p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <p><span className="text-gray-500">Ngân hàng:</span> MB Bank Quân Đội</p>
                  <p><span className="text-gray-500">Số tài khoản:</span> <strong>240420048888</strong></p>
                  <p><span className="text-gray-500">Chủ tài khoản:</span> <strong>NGUYEN DINH HOAI</strong></p>
                  <p><span className="text-gray-500">Số tiền:</span> <strong className="text-red-600">{formatPrice(totalAmount)}</strong></p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary mini review */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>Số lượng món:</span>
              <span className="font-bold">{cart.length} món</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính & Phí giao hàng:</span>
              <span>{formatPrice(subtotal + shippingFee)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-bold">
                <span>Voucher giảm giá:</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-gray-900 pt-1.5 border-t border-gray-200">
              <span>Tổng cộng cần trả:</span>
              <span className="text-orange-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-orange-600/25 active:scale-98 transition-all text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý đơn hàng...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Đặt Hàng Ngay • {formatPrice(totalAmount)}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
