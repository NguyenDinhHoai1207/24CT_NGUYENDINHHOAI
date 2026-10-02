import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { isDatabaseConnected } from "../config/db.js";
import { Store } from "../data/store.js";

// Helper tạo JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "secret_key_24CT_NguyenDinhHoai_pizza_deluxe_2026",
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );
};

// @desc    Đăng ký tài khoản mới
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu bảo mật phải có độ dài từ 6 ký tự trở lên"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Kiểm tra xem email đã tồn tại hay chưa
    let existingUser = null;
    if (isDatabaseConnected()) {
      existingUser = await User.findOne({ email: cleanEmail });
    } else {
      existingUser = await Store.findUserByEmail(cleanEmail);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Địa chỉ email này đã được đăng ký tài khoản. Vui lòng đăng nhập!"
      });
    }

    // Tạo người dùng mới
    let newUser = null;
    if (isDatabaseConnected()) {
      newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone || "",
        address: address || "",
        role: "customer"
      });
    } else {
      newUser = await Store.createUser({
        name,
        email: cleanEmail,
        password,
        phone,
        address,
        role: "customer"
      });
    }

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công!",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role,
        token
      }
    });
  } catch (error) {
    console.error("Lỗi đăng ký tài khoản:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi máy chủ khi đăng ký tài khoản",
      error: error.message
    });
  }
};

// @desc    Đăng nhập tài khoản
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ email và mật khẩu đăng nhập"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Tìm người dùng theo email
    let user = null;
    if (isDatabaseConnected()) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = await Store.findUserByEmail(cleanEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác"
      });
    }

    // So khớp mật khẩu
    let isMatch = false;
    if (user.matchPassword) {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác"
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Chào mừng ${user.name} đã quay trở lại!`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "customer",
        token
      }
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi máy chủ khi đăng nhập",
      error: error.message
    });
  }
};

// @desc    Lấy thông tin tài khoản hiện tại từ Token
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi xác thực thông tin người dùng"
    });
  }
};