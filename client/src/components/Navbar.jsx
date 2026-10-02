import React from "react";
import { ShoppingBag, Pizza, ShieldCheck, Clock, PhoneCall, LogIn, User, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar({ currentView, setCurrentView, onOpenTracking, user, onOpenAuth, onLogout }) {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span>🔥 Ưu đãi đặc biệt: Nhập mã <strong className="bg-white/20 px-1.5 py-0.5 rounded text-amber-200 uppercase">NGUYENDINHHOAI</strong> để giảm ngay 20%! Miễn phí giao hàng cho đơn từ 300.000đ.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <button 
          onClick={() => setCurrentView("menu")}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <Pizza className="w-7 h-7 transform group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 block">
              24CT_NguyenDinhHoai
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 flex items-center gap-1">
              PIZZA <span className="text-orange-600">DELUXE</span>
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setCurrentView("menu")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              currentView === "menu"
                ? "bg-orange-50 text-orange-600"
                : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
            }`}
          >
            Thực đơn Pizza
          </button>
          
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition-all"
          >
            <Clock className="w-4 h-4 text-orange-500" />
            Tra cứu đơn hàng
          </button>

          <button
            onClick={() => {
              if (user?.role === "admin") {
                setCurrentView("admin");
              } else {
                onOpenAuth("login");
              }
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              currentView === "admin"
                ? "bg-stone-900 text-white shadow-md shadow-stone-900/20"
                : "text-stone-700 bg-stone-100 hover:bg-stone-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            Quản trị (Admin)
          </button>
        </nav>

        {/* Actions (Cart & Hotline) */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end text-xs mr-2">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-green-500" /> Hotline đặt bánh:
            </span>
            <span className="font-extrabold text-gray-800 text-sm">1900 2424</span>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end text-right leading-tight">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Xin chào</span>
                <span className="text-sm font-extrabold text-gray-800">{user.name}</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:text-red-600 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth("login")}
                className="flex items-center gap-2 border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth("register")}
                className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Đăng ký</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {totalCount > 0 && (
              <span className="bg-white text-orange-600 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
