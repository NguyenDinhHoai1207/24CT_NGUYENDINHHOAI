import React from "react";
import { ShoppingBag, Pizza, ShieldCheck, Clock, LogIn, UserPlus, LogOut, User, FileDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { exportUserProfilePDF } from "../utils/exportPDF";

export default function Navbar({ currentView, setCurrentView, onOpenTracking, user, onOpenAuth, onLogout }) {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-semibold py-1.5 text-center">
        🔥 Nhập mã <strong className="bg-white/20 px-1.5 py-0.5 rounded text-yellow-200">NGUYENDINHHOAI</strong> giảm 20% · Miễn phí giao hàng đơn từ 300.000đ
      </div>

      {/* Main bar */}
      <div className="px-6 h-16 flex items-center gap-6">

        {/* Logo */}
        <button onClick={() => setCurrentView("menu")} className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform">
            <Pizza className="w-5 h-5" />
          </div>
          <div className="leading-none">
            <p className="text-[9px] font-black uppercase tracking-widest text-orange-500">24CT · NguyenDinhHoai</p>
            <p className="text-base font-black text-gray-900 tracking-tight">PIZZA <span className="text-orange-600">DELUXE</span></p>
          </div>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 shrink-0 hidden md:block" />

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setCurrentView("menu")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              currentView === "menu" ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
            }`}
          >
            Thực đơn
          </button>

          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <Clock className="w-4 h-4 shrink-0" />
            Tra cứu đơn
          </button>

          <button
            onClick={() => user?.role === "admin" ? setCurrentView("admin") : onOpenAuth("login")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              currentView === "admin" ? "bg-gray-900 text-white" : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-orange-400" />
            Quản trị
          </button>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Auth + Cart */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-600" />
                </div>
                <div className="leading-none">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Xin chào</p>
                  <p className="text-sm font-bold text-gray-800 max-w-[90px] truncate">{user.name}</p>
                </div>
              </div>

              {/* Nút xuất PDF */}
              <button
                onClick={() => exportUserProfilePDF(user)}
                title="Xuất thông tin tài khoản ra PDF"
                className="flex items-center gap-1.5 border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
              >
                <FileDown className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Xuất PDF</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-600 hover:text-red-600 hover:border-red-200 px-3 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth("login")}
                className="flex items-center gap-1.5 border border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                Đăng nhập
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="flex items-center gap-1.5 bg-gray-900 text-white hover:bg-gray-800 px-3 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                Đăng ký
              </button>
            </>
          )}

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-md active:scale-95 transition-all whitespace-nowrap"
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}