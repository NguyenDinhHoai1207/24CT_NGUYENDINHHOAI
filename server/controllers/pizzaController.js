import Pizza from "../models/Pizza.js";
import { isDatabaseConnected } from "../config/db.js";
import { Store } from "../data/store.js";

// @desc    Lấy danh sách tất cả Pizza (hỗ trợ lọc danh mục & tìm kiếm)
// @route   GET /api/pizzas
export const getPizzas = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isDatabaseConnected()) {
      let filter = {};
      if (category && category !== "all") {
        filter.category = category;
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ];
      }
      const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: pizzas.length, data: pizzas });
    } else {
      const pizzas = await Store.findPizzas({ category, search });
      return res.json({ success: true, count: pizzas.length, data: pizzas });
    }
  } catch (error) {
    console.error("Lỗi getPizzas:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi tải danh sách pizza", error: error.message });
  }
};

// @desc    Lấy chi tiết 1 Pizza
// @route   GET /api/pizzas/:id
export const getPizzaById = async (req, res) => {
  try {
    const { id } = req.params;
    let pizza = null;

    if (isDatabaseConnected()) {
      pizza = await Pizza.findById(id);
    } else {
      pizza = await Store.findPizzaById(id);
    }

    if (!pizza) {
      return res.status(404).json({ success: false, message: "Không tìm thấy món pizza này" });
    }

    res.json({ success: true, data: pizza });
  } catch (error) {
    console.error("Lỗi getPizzaById:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi lấy chi tiết pizza", error: error.message });
  }
};

// @desc    Tạo mới một món Pizza (Admin)
// @route   POST /api/pizzas
export const createPizza = async (req, res) => {
  try {
    const { name, description, category, price, image, badge, sizes, crusts, toppings, isAvailable, spicyLevel } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ tên, mô tả, giá và link hình ảnh" });
    }

    const pizzaData = {
      name,
      description,
      category: category || "classic",
      price: Number(price),
      image,
      badge: badge || "",
      sizes: sizes && sizes.length ? sizes : undefined,
      crusts: crusts && crusts.length ? crusts : undefined,
      toppings: toppings && toppings.length ? toppings : undefined,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      spicyLevel: Number(spicyLevel) || 0
    };

    let newPizza;
    if (isDatabaseConnected()) {
      newPizza = await Pizza.create(pizzaData);
    } else {
      newPizza = await Store.createPizza(pizzaData);
    }

    res.status(201).json({ success: true, message: "Thêm món pizza mới thành công!", data: newPizza });
  } catch (error) {
    console.error("Lỗi createPizza:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi tạo pizza", error: error.message });
  }
};

// @desc    Chỉnh sửa thông tin Pizza (Admin)
// @route   PUT /api/pizzas/:id
export const updatePizza = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedPizza;

    if (isDatabaseConnected()) {
      updatedPizza = await Pizza.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    } else {
      updatedPizza = await Store.updatePizza(id, req.body);
    }

    if (!updatedPizza) {
      return res.status(404).json({ success: false, message: "Không tìm thấy món pizza để cập nhật" });
    }

    res.json({ success: true, message: "Cập nhật món pizza thành công!", data: updatedPizza });
  } catch (error) {
    console.error("Lỗi updatePizza:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi cập nhật pizza", error: error.message });
  }
};

// @desc    Xóa món Pizza (Admin)
// @route   DELETE /api/pizzas/:id
export const deletePizza = async (req, res) => {
  try {
    const { id } = req.params;
    let deletedPizza;

    if (isDatabaseConnected()) {
      deletedPizza = await Pizza.findByIdAndDelete(id);
    } else {
      deletedPizza = await Store.deletePizza(id);
    }

    if (!deletedPizza) {
      return res.status(404).json({ success: false, message: "Không tìm thấy món pizza để xóa" });
    }

    res.json({ success: true, message: "Đã xóa món pizza thành công khỏi thực đơn!", data: deletedPizza });
  } catch (error) {
    console.error("Lỗi deletePizza:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi xóa pizza", error: error.message });
  }
};
