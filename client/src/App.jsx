import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import PizzaCard from "./components/PizzaCard";
import PizzaModal from "./components/PizzaModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import OrderTracker from "./components/OrderTracker";
import AdminDashboard from "./components/AdminDashboard";
import AuthModal from "./components/AuthModal";
import { api } from "./services/api";
import { useAuth } from "./context/AuthContext";
import { Search, Sparkles, Phone, Mail, MapPin, Heart, ArrowUp } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Tất Cả Món", icon: "🍕" },
  { id: "classic", label: "Truyền Thống", icon: "🇮🇹" },
  { id: "seafood", label: "Hải Sản Pesto", icon: "🦐" },
  { id: "meat", label: "Thịt Nướng BBQ", icon: "🥩" },
  { id: "vegetarian", label: "Chay Rau Củ", icon: "🥦" }
];

export default function App() {
  const { user: currentUser, logout } = useAuth();
  const [currentView, setCurrentView] = useState("menu");
  const [pizzas, setPizzas] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modals state
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const menuRef = useRef(null);

  // Load pizzas from API
  const fetchPizzas = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getPizzas(activeCategory, searchQuery);
      setPizzas(res.data?.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách pizza:", err);
      setError("Không thể kết nối tới máy chủ backend. Vui lòng kiểm tra server đang chạy!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPizzas();
  };

  const handleOrderSuccess = (order) => {
    setTrackedOrder(order);
    setIsTrackingOpen(true);
  };

  const handleOpenAuth = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setIsAuthOpen(false);
    if (user?.role === "admin") setCurrentView("admin");
  };

  const handleLogout = () => {
    logout();
    setCurrentView("menu");
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // If viewing Admin Dashboard
  if (currentView === "admin") {
    return (
      <div>
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenTracking={() => setIsTrackingOpen(true)}
          user={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />
        <AdminDashboard onBackToMenu={() => setCurrentView("menu")} />
        
        {/* Tracker Modal can still be opened */}
        <OrderTracker
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          initialOrder={trackedOrder}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenTracking={() => setIsTrackingOpen(true)}
        user={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Hero Banner */}
      <HeroBanner onExploreClick={scrollToMenu} />

      {/* Menu Section */}
      <main ref={menuRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-orange-600 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thực đơn chọn lọc</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Danh Sách Pizza Thơm Ngon
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              Tùy chỉnh đế bánh giòn, kích thước và thêm các loại topping hảo hạng theo khẩu vị riêng của bạn.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tìm kiếm pizza theo tên hoặc vị..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-xs"
            />
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-102"
                    : "bg-white hover:bg-orange-50 text-gray-700 border border-gray-200 hover:border-orange-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Pizza Cards Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-gray-500">Đang chuẩn bị thực đơn nóng hổi...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center bg-red-50 border border-red-200 rounded-3xl p-6 max-w-md mx-auto space-y-3">
            <p className="text-sm font-bold text-red-700">{error}</p>
            <button
              onClick={fetchPizzas}
              className="px-5 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow"
            >
              Thử lại
            </button>
          </div>
        ) : pizzas.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
            <p className="text-4xl">🍕</p>
            <h3 className="text-lg font-black text-gray-800">Không tìm thấy món pizza phù hợp</h3>
            <p className="text-xs text-gray-400">Hãy thử tìm với từ khóa khác hoặc chuyển danh mục.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pizzas.map((pizza) => (
              <PizzaCard
                key={pizza._id}
                pizza={pizza}
                onSelectPizza={(p) => setSelectedPizza(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-12 border-t border-gray-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <span className="text-2xl">🍕</span>
              <span>24CT_NguyenDinhHoai</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs">
              Ứng dụng web đặt hàng Pizza trực tuyến được xây dựng hoàn chỉnh trên nền tảng MERN Stack (MongoDB, Express, React, Node.js).
            </p>
            <div className="inline-block bg-white/10 text-orange-400 px-3 py-1 rounded-lg font-bold text-[11px]">
              Tác giả: Nguyễn Đình Hoài
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Danh mục món</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveCategory("classic")} className="hover:text-white transition-colors">Pizza Truyền Thống</button></li>
              <li><button onClick={() => setActiveCategory("seafood")} className="hover:text-white transition-colors">Pizza Hải Sản Sốt Pesto</button></li>
              <li><button onClick={() => setActiveCategory("meat")} className="hover:text-white transition-colors">Pizza Thịt Bò Nướng BBQ</button></li>
              <li><button onClick={() => setActiveCategory("vegetarian")} className="hover:text-white transition-colors">Pizza Chay Nấm Rau Củ</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setIsTrackingOpen(true)} className="hover:text-white transition-colors">Tra cứu đơn hàng</button></li>
              <li><span className="hover:text-white transition-colors">Chính sách giao hàng 30 phút</span></li>
              <li><span className="hover:text-white transition-colors">Cam kết an toàn thực phẩm</span></li>
              <li><button onClick={() => setCurrentView("admin")} className="text-orange-400 hover:underline">Trang quản trị (Admin)</button></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Liên hệ & Đặt hàng</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-500" /> Hotline: 1900 2424</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange-500" /> support@24ct-pizza.vn</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /> Hồ Chí Minh, Việt Nam</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
          <p>© 2026 24CT_NguyenDinhHoai. Toàn bộ mã nguồn MERN Stack chuẩn.</p>
          <p className="flex items-center gap-1">
            Thiết kế bằng <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> cho dự án thực tế.
          </p>
        </div>
      </footer>

      {/* Floating Modals & Drawers */}
      
      {/* 1. Pizza Customization Modal */}
      {selectedPizza && (
        <PizzaModal
          pizza={selectedPizza}
          onClose={() => setSelectedPizza(null)}
        />
      )}

      {/* 2. Cart Slide-over Drawer */}
      <CartDrawer
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        user={currentUser}
      />

      <AuthModal
        isOpen={isAuthOpen}
        defaultMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 4. Order Tracker Modal */}
      <OrderTracker
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrder={trackedOrder}
      />
    </div>
  );
}
