import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isDatabaseConnected } from "../config/db.js";
import { Store } from "../data/store.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret_key_24CT_NguyenDinhHoai_pizza_deluxe_2026"
      );

      let currentUser = null;
      if (isDatabaseConnected()) {
        currentUser = await User.findById(decoded.id).select("-password");
      } else {
        currentUser = await Store.findUserById(decoded.id);
        if (currentUser) {
          const { password, ...userWithoutPassword } = currentUser;
          currentUser = userWithoutPassword;
        }
      }

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản không tồn tại hoặc phiên đăng nhập đã hết hạn"
        });
      }

      req.user = currentUser;
      next();
    } catch (error) {
      console.error("Lỗi xác thực Token:", error.message);
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!"
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập để thực hiện thao tác này"
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Quyền truy cập bị từ chối: Tính năng này chỉ dành cho Quản trị viên (Admin)!"
    });
  }
};