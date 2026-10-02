import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as loginApi, register as registerApi } from '../services/api';

export default function AuthModal({ isOpen, defaultMode, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(defaultMode !== 'register');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  React.useEffect(() => {
    setIsLogin(defaultMode !== 'register');
    setError('');
  }, [defaultMode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await loginApi({ email: formData.email, password: formData.password });
        if (res.data.success) {
          login(res.data.data, res.data.data.token);
          if (onAuthSuccess) onAuthSuccess(res.data.data);
          onClose();
        }
      } else {
        const res = await registerApi(formData);
        if (res.data.success) {
          login(res.data.data, res.data.data.token);
          if (onAuthSuccess) onAuthSuccess(res.data.data);
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
          </h2>
          <p className="text-gray-500 text-center mb-6">
            {isLogin ? 'Chào mừng bạn quay lại với 24CT Pizza!' : 'Tham gia để nhận nhiều ưu đãi hấp dẫn!'}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="Họ và tên" required={!isLogin}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="Địa chỉ Email" required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password" name="password"
                value={formData.password} onChange={handleChange}
                placeholder="Mật khẩu" required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>

            {!isLogin && (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel" name="phone"
                    value={formData.phone} onChange={handleChange}
                    placeholder="Số điện thoại"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text" name="address"
                    value={formData.address} onChange={handleChange}
                    placeholder="Địa chỉ giao hàng"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </>
            )}

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}