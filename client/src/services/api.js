const API_BASE = "/api";

const getJsonHeaders = (token = null) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

export const api = {
  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Đăng ký thất bại");
    return result;
  },

  async login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Đăng nhập thất bại");
    return result;
  },

  async getCurrentUser(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getJsonHeaders(token)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Không thể lấy thông tin tài khoản");
    return result;
  },

  // Lấy danh sách pizza
  async getPizzas(category = "all", search = "") {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    
    const url = `${API_BASE}/pizzas${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Không thể tải danh sách pizza");
    return res.json();
  },

  // Chi tiết 1 pizza
  async getPizzaById(id) {
    const res = await fetch(`${API_BASE}/pizzas/${id}`);
    if (!res.ok) throw new Error("Không thể lấy thông tin bánh");
    return res.json();
  },

  // Thêm pizza mới (Admin)
  async createPizza(data) {
    const res = await fetch(`${API_BASE}/pizzas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Lỗi tạo món pizza");
    return result;
  },

  // Cập nhật pizza (Admin)
  async updatePizza(id, data) {
    const res = await fetch(`${API_BASE}/pizzas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Lỗi cập nhật món");
    return result;
  },

  // Xóa pizza (Admin)
  async deletePizza(id) {
    const res = await fetch(`${API_BASE}/pizzas/${id}`, {
      method: "DELETE"
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Lỗi xóa món");
    return result;
  },

  // Đặt hàng
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Lỗi tạo đơn hàng");
    return result;
  },

  // Danh sách đơn hàng (Admin)
  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
    return res.json();
  },

  // Tra cứu đơn hàng theo ID hoặc OrderCode
  async getOrderById(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
    return res.json();
  },

  // Cập nhật trạng thái đơn hàng (Admin)
  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Lỗi cập nhật trạng thái đơn");
    return result;
  },

  // Thống kê đơn hàng (Admin)
  async getStats() {
    const res = await fetch(`${API_BASE}/orders/stats/summary`);
    if (!res.ok) throw new Error("Không thể tải báo cáo");
    return res.json();
  }
};
