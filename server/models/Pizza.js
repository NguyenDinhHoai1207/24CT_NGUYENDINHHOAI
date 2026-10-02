import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  extraPrice: { type: Number, default: 0 }
}, { _id: false });

const crustSchema = new mongoose.Schema({
  name: { type: String, required: true },
  extraPrice: { type: Number, default: 0 }
}, { _id: false });

const toppingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 }
}, { _id: false });

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập tên pizza"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Vui lòng nhập mô tả món pizza"]
  },
  category: {
    type: String,
    required: true,
    enum: ["classic", "seafood", "meat", "vegetarian", "beverage"],
    default: "classic"
  },
  price: {
    type: Number,
    required: [true, "Vui lòng nhập giá cơ bản"],
    min: [0, "Giá không được âm"]
  },
  image: {
    type: String,
    required: [true, "Vui lòng cung cấp link hình ảnh món bánh"]
  },
  badge: {
    type: String,
    default: ""
  },
  sizes: {
    type: [sizeSchema],
    default: [
      { name: "Nhỏ 20cm", extraPrice: 0 },
      { name: "Vừa 25cm", extraPrice: 40000 },
      { name: "Lớn 30cm", extraPrice: 80000 }
    ]
  },
  crusts: {
    type: [crustSchema],
    default: [
      { name: "Đế mỏng giòn", extraPrice: 0 },
      { name: "Đế dày truyền thống", extraPrice: 0 },
      { name: "Viền phô mai béo ngậy", extraPrice: 35000 },
      { name: "Viền xúc xích phô mai", extraPrice: 45000 }
    ]
  },
  toppings: {
    type: [toppingSchema],
    default: [
      { name: "Thêm phô mai Mozzarella", price: 25000 },
      { name: "Thêm Pepperoni Mỹ", price: 30000 },
      { name: "Thêm thịt bò băm BBQ", price: 35000 },
      { name: "Thêm nấm mỡ tươi", price: 20000 },
      { name: "Ớt chuông & hành tây", price: 15000 }
    ]
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.8
  },
  spicyLevel: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Pizza = mongoose.models.Pizza || mongoose.model("Pizza", pizzaSchema);
export default Pizza;
