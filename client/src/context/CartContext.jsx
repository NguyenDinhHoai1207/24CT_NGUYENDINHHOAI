import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("pizza_cart_24CT");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem("pizza_cart_24CT", JSON.stringify(cart));
    } catch (e) {
      console.error("Lỗi lưu giỏ hàng:", e);
    }
  }, [cart]);

  // Thêm pizza với tùy chỉnh vào giỏ hàng
  const addToCart = (pizza, size, crust, toppings = [], quantity = 1, specialInstructions = "") => {
    const toppingsPrice = toppings.reduce((sum, t) => sum + (t.price || 0), 0);
    const unitPrice = pizza.price + (size?.extraPrice || 0) + (crust?.extraPrice || 0) + toppingsPrice;
    
    // Tạo ID độc nhất dựa trên bánh và các tùy chọn được chọn
    const toppingNames = toppings.map(t => t.name).sort().join("|");
    const cartItemId = `${pizza._id}_${size?.name || "def"}_${crust?.name || "def"}_${toppingNames}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalItemPrice: newQty * unitPrice,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions
        };
        return updated;
      } else {
        const newItem = {
          cartItemId,
          pizzaId: pizza._id,
          name: pizza.name,
          image: pizza.image,
          size: size || { name: "Nhỏ 20cm", extraPrice: 0 },
          crust: crust || { name: "Đế mỏng giòn", extraPrice: 0 },
          toppings: toppings || [],
          unitPrice,
          quantity,
          totalItemPrice: unitPrice * quantity,
          specialInstructions
        };
        return [...prevCart, newItem];
      }
    });

    setIsCartOpen(true);
  };

  // Cập nhật số lượng
  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity: newQty,
              totalItemPrice: newQty * item.unitPrice
            }
          : item
      )
    );
  };

  // Xóa món khỏi giỏ
  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  // Làm trống giỏ hàng
  const clearCart = () => {
    setCart([]);
    setDiscountCode("");
    setDiscountPercent(0);
  };

  // Áp dụng voucher khuyến mãi
  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === "NGUYENDINHHOAI" || clean === "PIZZA20") {
      setDiscountCode(clean);
      setDiscountPercent(0.2); // Giảm 20%
      return { success: true, message: "Áp dụng mã giảm giá 20% thành công!" };
    }
    if (clean === "FREESHIP") {
      setDiscountCode(clean);
      setDiscountPercent(0.1);
      return { success: true, message: "Áp dụng mã giảm 10% thành công!" };
    }
    return { success: false, message: "Mã giảm giá không hợp lệ hoặc đã hết hạn" };
  };

  // Tính toán tổng tiền
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.totalItemPrice, 0);
  
  // Miễn phí ship cho đơn từ 300.000đ trở lên
  const shippingFee = subtotal >= 300000 || subtotal === 0 ? 0 : 20000;
  const discountAmount = Math.round(subtotal * discountPercent);
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        subtotal,
        shippingFee,
        discountAmount,
        discountCode,
        discountPercent,
        applyPromoCode,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
