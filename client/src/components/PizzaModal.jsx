import React, { useState } from "react";
import { X, Check, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function PizzaModal({ pizza, onClose }) {
  const { addToCart } = useCart();

  // Selected states
  const [selectedSize, setSelectedSize] = useState(
    pizza.sizes && pizza.sizes.length ? pizza.sizes[0] : { name: "Nhỏ 20cm", extraPrice: 0 }
  );

  const [selectedCrust, setSelectedCrust] = useState(
    pizza.crusts && pizza.crusts.length ? pizza.crusts[0] : { name: "Đế mỏng giòn", extraPrice: 0 }
  );

  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const formatPrice = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  // Toggle topping
  const handleToggleTopping = (topping) => {
    if (selectedToppings.some(t => t.name === topping.name)) {
      setSelectedToppings(selectedToppings.filter(t => t.name !== topping.name));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  // Compute live price
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + (t.price || 0), 0);
  const unitPrice = pizza.price + (selectedSize.extraPrice || 0) + (selectedCrust.extraPrice || 0) + toppingsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(pizza, selectedSize, selectedCrust, selectedToppings, quantity, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header with Image banner */}
        <div className="relative h-48 sm:h-56 bg-orange-100 flex-shrink-0">
          <img
            src={pizza.image}
            alt={pizza.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            {pizza.badge && (
              <span className="inline-block bg-orange-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5 shadow">
                {pizza.badge}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-black">{pizza.name}</h2>
            <p className="text-xs sm:text-sm text-gray-200 line-clamp-1 mt-0.5">{pizza.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* 1. Kích thước bánh (Size) */}
          <div>
            <label className="block text-gray-900 font-extrabold text-base mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-black">1</span>
              Chọn Kích Thước Bánh <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(pizza.sizes || []).map((size, idx) => {
                const isSelected = selectedSize.name === size.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">{size.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                    </div>
                    <span className="text-xs text-orange-600 font-semibold">
                      {size.extraPrice > 0 ? `+${formatPrice(size.extraPrice)}` : "Chuẩn"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Loại đế bánh (Crust) */}
          <div>
            <label className="block text-gray-900 font-extrabold text-base mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-black">2</span>
              Chọn Loại Đế Bánh <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(pizza.crusts || []).map((crust, idx) => {
                const isSelected = selectedCrust.name === crust.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCrust(crust)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-gray-900 block">{crust.name}</span>
                      <span className="text-xs text-orange-600 font-semibold">
                        {crust.extraPrice > 0 ? `+${formatPrice(crust.extraPrice)}` : "Miễn phí"}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-orange-600 flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Topping bổ sung (Tùy chọn) */}
          {pizza.toppings && pizza.toppings.length > 0 && (
            <div>
              <label className="block text-gray-900 font-extrabold text-base mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-black">3</span>
                Thêm Topping Yêu Thích <span className="text-gray-400 font-normal text-xs">(Không bắt buộc)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pizza.toppings.map((top, idx) => {
                  const isChecked = selectedToppings.some(t => t.name === top.name);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleTopping(top)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? "border-orange-500 bg-orange-50/40 text-orange-950 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                            isChecked ? "bg-orange-500 border-orange-500 text-white" : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-medium text-xs sm:text-sm">{top.name}</span>
                      </div>
                      <span className="text-xs text-orange-600 font-bold ml-2">
                        +{formatPrice(top.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Ghi chú món bánh */}
          <div>
            <label className="block text-gray-900 font-extrabold text-sm mb-2">
              Ghi chú cho đầu bếp
            </label>
            <input
              type="text"
              placeholder="VD: Cắt bánh làm 8 phần, cho ít ớt chuông, thêm tương cà..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm"
            />
          </div>

        </div>

        {/* Modal Footer (Quantity & Add button) */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          {/* Quantity selector */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 flex items-center justify-center transition-colors active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-black text-base w-6 text-center text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 flex items-center justify-center transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to cart CTA */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-orange-600/25 active:scale-98 transition-all text-sm sm:text-base"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Thêm vào giỏ hàng • {formatPrice(totalPrice)}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
