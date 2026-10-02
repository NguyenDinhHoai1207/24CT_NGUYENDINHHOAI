import React, { useEffect, useState } from "react";
import { X, Mail, Lock, User, Phone, MapPin, Loader2 } from "lucide-react";
import { api } from "../services/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  address: ""
};

export default function AuthModal({ isOpen, onClose, onAuthSuccess, defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMode(defaultMode);
    setError("");
    setFormData(EMPTY_FORM);
  }, [defaultMode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      };

      const result = mode === "register"
        ? await api.register(payload)
        : await api.login({ email: payload.email, password: payload.password });

      const user = result.data;
      localStorage.setItem("pizza_user_24CT", JSON.stringify(user));
      localStorage.setItem("pizza_token_24CT", user.token);

      onAuthSuccess(user);
      onClose();
      setFormData(EMPTY_FORM);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-100">Tài khoản</p>
            <h3 className="text-2xl font-black mt-1">{mode === "login" ? "Đăng nhập" : "Đăng ký"}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === "login" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === "register" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
              }`}
            >
              Đăng ký
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" /> Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Đình Hoài"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                required={mode === "register"}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" /> Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              required
            />
          </div>

          {mode === "register" && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0987654321"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Số nhà, phường, quận, thành phố"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-60 text-white font-black py-3.5 text-sm shadow-lg shadow-orange-600/25"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === "login" ? "Đang đăng nhập..." : "Đang đăng ký..."}</span>
              </>
            ) : (
              <span>{mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
