import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Lay thoi gian chuan gio Viet Nam (GMT+7)
const getVietnamDate = () => {
  return new Date(Date.now() + 7 * 60 * 60 * 1000);
};

const getVietnamTimeISO = () => {
  const vnTime = getVietnamDate();
  return vnTime.toISOString().replace("Z", "+07:00");
};

const getVietnamTimeText = () => {
  const vnTime = getVietnamDate();
  return vnTime.toISOString().replace("T", " ").substring(0, 19) + " (Giờ VN)";
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập họ và tên"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Vui lòng nhập địa chỉ email"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Vui lòng nhập mật khẩu"],
    minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"]
  },
  phone: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ["customer", "staff", "admin"],
    default: "customer"
  },
  createdAt: {
    type: Date,
    default: getVietnamDate
  },
  updatedAt: {
    type: Date,
    default: getVietnamDate
  },
  createdAtVN: {
    type: String,
    default: getVietnamTimeISO
  },
  ngayGioDangKy: {
    type: String,
    default: getVietnamTimeText
  }
}, {
  timestamps: false // Dung createdAt va updatedAt tuy bien theo gio Viet Nam
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  this.updatedAt = getVietnamDate();
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
