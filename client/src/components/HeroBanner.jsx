import React from "react";
import { Sparkles, Timer, Flame, Award, ArrowDown } from "lucide-react";

export default function HeroBanner({ onExploreClick }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-white to-gray-50 py-12 md:py-20 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Dự Án MERN Stack: 24CT_NguyenDinhHoai</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.15] tracking-tight">
              Pizza Nướng Củi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Thơm Lừng Chuẩn Ý
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Thưởng thức những chiếc bánh pizza tươi mới nướng giòn rụm trong lò củi, phô mai Mozzarella chảy dẻo quyến rũ, và topping thượng hạng được tùy biến chuẩn vị của riêng bạn.
            </p>

            {/* Value Props Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center lg:items-start">
                <Timer className="w-6 h-6 text-orange-500 mb-1" />
                <span className="text-xs text-gray-400 font-medium">Giao Nhanh</span>
                <span className="text-sm font-extrabold text-gray-800">Dưới 30 Phút</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center lg:items-start">
                <Flame className="w-6 h-6 text-red-500 mb-1" />
                <span className="text-xs text-gray-400 font-medium">Nướng Củi</span>
                <span className="text-sm font-extrabold text-gray-800">100% Nóng Hổi</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center lg:items-start">
                <Award className="w-6 h-6 text-amber-500 mb-1" />
                <span className="text-xs text-gray-400 font-medium">Nguyên Liệu</span>
                <span className="text-sm font-extrabold text-gray-800">Tươi Mỗi Ngày</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all text-base"
              >
                <span>Khám phá thực đơn</span>
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>
            </div>
          </div>

          {/* Right Pizza Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient blur circle */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-orange-500/20 rounded-full blur-3xl -z-0"></div>

            <div className="relative z-10 group">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80"
                alt="Pizza Nóng Hổi Ngon Mắt"
                className="w-72 h-72 sm:w-96 sm:h-96 object-cover rounded-full shadow-2xl border-8 border-white group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-4 sm:left-2 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg">
                  ★
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Đánh giá trung bình</p>
                  <p className="text-sm font-extrabold text-gray-900">4.9 / 5.0 (2,400+ đánh giá)</p>
                </div>
              </div>

              {/* Discount Ribbon */}
              <div className="absolute top-4 -right-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg transform rotate-6 uppercase tracking-wider">
                Giảm 20% Hôm Nay!
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
