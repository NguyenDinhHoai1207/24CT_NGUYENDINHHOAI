import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  pizzaId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  size: {
    name: { type: String, default: "Nhỏ 20cm" },
    extraPrice: { type: Number, default: 0 }
  },
  crust: {
    name: { type: String, default: "Đế mỏng giòn" },
    extraPrice: { type: Number, default: 0 }
  },
  toppings: [{
    name: { type: String },
    price: { type: Number }
  }],
  itemPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  totalItemPrice: { type: Number, required: true },
  specialInstructions: { type: String, default: "" }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderCode: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: { type: String, required: [true, "Vui lòng nhập tên khách hàng"], trim: true },
    phone: { type: String, required: [true, "Vui lòng nhập số điện thoại"], trim: true },
    address: { type: String, required: [true, "Vui lòng nhập địa chỉ nhận hàng"], trim: true },
    note: { type: String, default: "" }
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: [val => val.length > 0, "Đơn hàng phải có ít nhất 1 món"]
  },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 20000 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cod", "banking", "card"],
    default: "cod"
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "baking", "delivering", "completed", "cancelled"],
    default: "pending"
  }
}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
