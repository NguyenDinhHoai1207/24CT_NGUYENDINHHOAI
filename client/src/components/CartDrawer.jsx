import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, CheckCircle, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ onCheckout }) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    discountAmount,
    discountCode,
    applyPromoCode,
    totalAmount
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [promoMessage, setPromoMessage] = useState(null);

  if (!isCartOpen) return null;

  const formatPrice = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const handleApplyCode = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const result = applyPromoCode(inputCode);
    setPromoMessage(result);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-black text-gray-900">Giỏ hàng của bạn</h2>
              <span className="text-xs bg-orange-100 text-orange-700 font-extrabold px-2 py-0.5 rounded-full">
                {cart.length} món
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
                >
                  Xóa hết
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-extrabold text-gray-800">Giỏ hàng của bạn đang trống</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Hãy thêm những chiếc pizza thơm ngon nóng hổi từ thực đơn để tiếp tục thưởng thức nhé!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-orange-600/20"
                >
                  Chọn pizza ngay
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex gap-3 relative group"
                >
                  {/* Pizza image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between pr-5">
                      <h4 className="font-extrabold text-gray-900 text-sm truncate">
                        {item.name}
                      </h4>
                    </div>

                    <div className="text-[11px] text-gray-500 space-y-0.5 mt-1">
                      <p>
                        <span className="font-semibold text-gray-700">Size:</span> {item.size?.name}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Đế:</span> {item.crust?.name}
                      </p>
                      {item.toppings && item.toppings.length > 0 && (
                        <p className="truncate">
                          <span className="font-semibold text-gray-700">Topping:</span>{" "}
                          {item.toppings.map(t => t.name).join(", ")}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="italic text-orange-600 truncate">
                          Ghi chú: "{item.specialInstructions}"
                        </p>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-orange-600">
                        {formatPrice(item.totalItemPrice)}
                      </span>

                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-5 h-5 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black w-4 text-center text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-5 h-5 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove icon button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer (Voucher & Checkout) */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4">
              
              {/* Promo code form */}
              <form onSubmit={handleApplyCode} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Mã voucher (VD: NGUYENDINHHOAI)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex-shrink-0"
                  >
                    Áp dụng
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] font-semibold flex items-center gap-1 ${
                    promoMessage.success ? "text-green-600" : "text-red-500"
                  }`}>
                    {promoMessage.success ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {promoMessage.message}
                  </p>
                )}
              </form>

              {/* Price summary table */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>Tạm tính ({cart.length} món):</span>
                  <span className="font-bold text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng (Giao nhanh):</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-bold">Miễn phí (Đơn ≥ 300k)</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Khuyến mãi ({discountCode}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-dashed border-gray-200">
                  <span>Tổng thanh toán:</span>
                  <span className="text-orange-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl shadow-orange-600/25 active:scale-98 transition-all text-sm"
              >
                <span>Tiến hành đặt hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
