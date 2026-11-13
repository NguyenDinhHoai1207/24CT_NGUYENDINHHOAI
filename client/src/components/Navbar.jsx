import React from "react";
import { ShoppingBag, Pizza, ShieldCheck, Clock, LogIn, UserPlus, LogOut, User, FileDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { exportUserProfilePDF } from "../utils/exportPDF";

export default function Navbar({ currentView, setCurrentView, onOpenTracking, user, onOpenAuth, onLogout }) {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">

        {/* Left: Brand */}
        <div 
          onClick={() => setCurrentView("menu")}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
            <Pizza className="w-5 h-5 animate-pulse" />
          </div>
          <div className="leading-tight">
            <span className="text-[10px] font-bold text-orange-600 tracking-wider uppercase block">
              24CT • NGUYENDINHHOAI
            </span>
            <span className="text-lg font-black text-gray-900 tracking-tight block">
              PIZZA DELUXE
            </span>
          </div>
        </div>

        {/* Center-Left: Navigation buttons */}
        <nav className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setCurrentView("menu")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              currentView === "menu" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>Thực đơn</span>
          </button>

          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 whitespace-nowrap transition-colors"
          >
            <Clock className="w-4 h-4 shrink-0 text-gray-400" />
            <span className="hidden sm:inline">Tra cứu đơn</span>
          </button>

          {/* Quản trị (Admin / Staff) */}
          {(user?.role === "admin" || user?.role === "staff") && (
            <button
              onClick={() => setCurrentView("admin")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                currentView === "admin" ? "bg-gray-900 text-white" : "text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-orange-400" />
              <span>{user?.role === "admin" ? "Quản trị" : "Duyệt đơn"}</span>
            </button>
          )}
        </nav>

        {/* Spacer đẩy các nút sang 2 bên */}
        <div className="flex-1" />

        {/* Right: Auth + Cart */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {/* User badge kèm vai trò */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  user.role === 'admin' ? 'bg-red-100 text-red-600' : (user.role === 'staff' ? 'bg-amber-100 text-amber-600' : 'bg-orange-100 text-orange-600')
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="leading-none">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Xin chào</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                      user.role === 'admin' 
                        ? 'bg-red-500 text-white' 
                        : (user.role === 'staff' ? 'bg-amber-500 text-white' : 'bg-blue-100 text-blue-700')
                    }`}>
                      {user.role === 'admin' ? 'Admin' : (user.role === 'staff' ? 'Nhân viên' : 'Khách')}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 max-w-[110px] truncate mt-0.5">{user.name}</p>
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
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth("login")}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Đăng ký</span>
              </button>
            </div>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold px-3.5 py-2 rounded-xl shadow-md shadow-orange-500/20 transition-all shrink-0"
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <span className="text-sm font-extrabold hidden sm:inline">Giỏ hàng</span>
            {totalCount > 0 && (
              <span className="bg-white text-orange-600 text-xs font-black px-1.5 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
