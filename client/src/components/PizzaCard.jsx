import React from "react";
import { Plus, Flame, Star, Sparkles } from "lucide-react";

export default function PizzaCard({ pizza, onSelectPizza }) {
  const formatPrice = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-orange-50">
        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

        {/* Badge */}
        {pizza.badge && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            {pizza.badge}
          </div>
        )}

        {/* Rating & Spicy */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
          <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{pizza.rating || 4.8}</span>
          </div>

          {pizza.spicyLevel > 0 && (
            <div className="bg-red-600/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-0.5">
              {Array.from({ length: pizza.spicyLevel }).map((_, i) => (
                <Flame key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              ))}
              <span className="ml-0.5 text-[11px]">Cay</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
            {pizza.name}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {pizza.description}
          </p>
        </div>

        {/* Footer info & button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-gray-400 font-semibold block">Giá từ</span>
            <span className="text-lg sm:text-xl font-black text-orange-600 tracking-tight">
              {formatPrice(pizza.price)}
            </span>
          </div>

          <button
            onClick={() => onSelectPizza(pizza)}
            className="flex items-center gap-2 bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white font-extrabold px-4 py-2.5 rounded-2xl transition-all shadow-sm hover:shadow-orange-500/20 active:scale-95 text-xs sm:text-sm"
          >
            <span>Tùy chỉnh & Đặt</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
