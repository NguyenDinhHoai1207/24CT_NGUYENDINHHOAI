import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { samplePizzas } from "./samplePizzas.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "db.json");

// Helper to hash password synchronously for initial seed
const getHashedPass = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// Initial Seed Users for Demo & Grading
const defaultUsers = [
  {
    _id: "user_admin_01",
    name: "Nguyễn Đình Hoài (Admin)",
    email: "admin@pizza.vn",
    password: getHashedPass("admin123"),
    phone: "0901234567",
    address: "Trụ sở Pizza 24CT, TP. Hồ Chí Minh",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "user_customer_01",
    name: "Nguyễn Đình Hoài",
    email: "hoai@24ct.vn",
    password: getHashedPass("123456"),
    phone: "0987654321",
    address: "Số 24 Đường Đại Học, Linh Trung, TP. Thủ Đức",
    role: "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper to initialize db.json if not exists or missing users
const initDb = () => {
  let data = { pizzas: [], orders: [], users: [] };
  
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      data = JSON.parse(raw);
    } catch (err) {
    }
  }

  let needSave = false;

  if (!data.pizzas || data.pizzas.length === 0) {
    data.pizzas = samplePizzas.map((p, idx) => ({
      ...p,
      _id: `pizza_${Date.now()}_${idx + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    needSave = true;
  }

  if (!data.orders) {
    data.orders = [];
    needSave = true;
  }

  if (!data.users || data.users.length === 0) {
    data.users = defaultUsers;
    needSave = true;
  }

  if (needSave) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  return data;
};

export const getStoreData = () => initDb();

export const saveStoreData = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
};

export const Store = {
  // Pizza operations
  async findPizzas(query = {}) {
    const data = getStoreData();
    let result = [...data.pizzas];
    if (query.category && query.category !== "all") {
      result = result.filter(p => p.category === query.category);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async findPizzaById(id) {
    const data = getStoreData();
    return data.pizzas.find(p => p._id.toString() === id.toString()) || null;
  },

  async createPizza(pizzaData) {
    const data = getStoreData();
    const newPizza = {
      ...pizzaData,
      _id: `pizza_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.pizzas.unshift(newPizza);
    saveStoreData(data);
    return newPizza;
  },

  async updatePizza(id, updateData) {
    const data = getStoreData();
    const index = data.pizzas.findIndex(p => p._id.toString() === id.toString());
    if (index === -1) return null;
    data.pizzas[index] = {
      ...data.pizzas[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    saveStoreData(data);
    return data.pizzas[index];
  },

  async deletePizza(id) {
    const data = getStoreData();
    const index = data.pizzas.findIndex(p => p._id.toString() === id.toString());
    if (index === -1) return null;
    const deleted = data.pizzas.splice(index, 1)[0];
    saveStoreData(data);
    return deleted;
  },

  // Order operations
  async findOrders() {
    const data = getStoreData();
    return [...data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findOrderById(id) {
    const data = getStoreData();
    return data.orders.find(o => o._id.toString() === id.toString() || o.orderCode === id) || null;
  },

  async createOrder(orderData) {
    const data = getStoreData();
    const newOrder = {
      ...orderData,
      _id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.orders.unshift(newOrder);
    saveStoreData(data);
    return newOrder;
  },

  async updateOrderStatus(id, status) {
    const data = getStoreData();
    const order = data.orders.find(o => o._id.toString() === id.toString() || o.orderCode === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    saveStoreData(data);
    return order;
  },

  // User operations
  async findUserByEmail(email) {
    const data = getStoreData();
    const cleanEmail = email.trim().toLowerCase();
    return data.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findUserById(id) {
    const data = getStoreData();
    return data.users.find(u => u._id.toString() === id.toString()) || null;
  },

  async createUser(userData) {
    const data = getStoreData();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: hashedPassword,
      phone: userData.phone || "",
      address: userData.address || "",
      role: userData.role || "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.users.unshift(newUser);
    saveStoreData(data);
    return newUser;
  }
};