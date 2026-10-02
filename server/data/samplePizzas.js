export const samplePizzas = [
  {
    name: "Pizza Hải Sản Sốt Pesto Thượng Hạng",
    description: "Tôm sú tươi giòn, mực lá, ớt chuông đỏ quyện cùng xốt ngò tây Pesto xanh thơm lừng và lớp phô mai Mozzarella béo ngậy chảy sợi.",
    category: "seafood",
    price: 189000,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    badge: "Bếp Trưởng Đề Xuất",
    rating: 4.9,
    spicyLevel: 1,
    sizes: [
      { name: "Nhỏ (20cm)", extraPrice: 0 },
      { name: "Vừa (25cm)", extraPrice: 40000 },
      { name: "Lớn (30cm)", extraPrice: 85000 }
    ],
    crusts: [
      { name: "Đế mỏng giòn rụm", extraPrice: 0 },
      { name: "Đế dày truyền thống xốp mềm", extraPrice: 0 },
      { name: "Đế viền phô mai béo ngậy", extraPrice: 35000 },
      { name: "Đế viền phô mai xúc xích", extraPrice: 45000 }
    ],
    toppings: [
      { name: "Thêm tôm sú tươi", price: 35000 },
      { name: "Thêm phô mai Mozzarella dẻo", price: 25000 },
      { name: "Thêm nấm mỡ tươi", price: 20000 },
      { name: "Thêm ớt chuông ngọt", price: 15000 }
    ],
    isAvailable: true
  },
  {
    name: "Pizza Pepperoni Mỹ Cổ Điển",
    description: "Vị cay nhẹ đặc trưng của xúc xích Pepperoni nhập khẩu hòa quyện sốt cà chua Ý truyền thống và ngập tràn phô mai Mozzarella vàng óng.",
    category: "classic",
    price: 159000,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    badge: "Bán Chạy Nhất",
    rating: 4.8,
    spicyLevel: 1,
    sizes: [
      { name: "Nhỏ (20cm)", extraPrice: 0 },
      { name: "Vừa (25cm)", extraPrice: 40000 },
      { name: "Lớn (30cm)", extraPrice: 80000 }
    ],
    crusts: [
      { name: "Đế mỏng giòn rụm", extraPrice: 0 },
      { name: "Đế dày truyền thống xốp mềm", extraPrice: 0 },
      { name: "Đế viền phô mai béo ngậy", extraPrice: 35000 },
      { name: "Đế viền phô mai xúc xích", extraPrice: 45000 }
    ],
    toppings: [
      { name: "Thêm gấp đôi Pepperoni", price: 35000 },
      { name: "Thêm phô mai Mozzarella dẻo", price: 25000 },
      { name: "Thêm ớt Jalapeno cay nồng", price: 15000 }
    ],
    isAvailable: true
  },
  {
    name: "Pizza Bò Nướng BBQ Phô Mai",
    description: "Thịt bò Úc băm ướp sốt BBQ đậm đà thơm mùi khói gỗ sồi, kết hợp cùng ngô ngọt, hành tây tím và phô mai nướng xém cạnh quyến rũ.",
    category: "meat",
    price: 179000,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    badge: "Món Mới",
    rating: 4.9,
    spicyLevel: 0,
    sizes: [
      { name: "Nhỏ (20cm)", extraPrice: 0 },
      { name: "Vừa (25cm)", extraPrice: 40000 },
      { name: "Lớn (30cm)", extraPrice: 80000 }
    ],
    crusts: [
      { name: "Đế mỏng giòn rụm", extraPrice: 0 },
      { name: "Đế dày truyền thống xốp mềm", extraPrice: 0 },
      { name: "Đế viền phô mai béo ngậy", extraPrice: 35000 },
      { name: "Đế viền phô mai xúc xích", extraPrice: 45000 }
    ],
    toppings: [
      { name: "Thêm thịt bò băm BBQ", price: 35000 },
      { name: "Thêm thịt ba chỉ xông khói", price: 30000 },
      { name: "Thêm phô mai Mozzarella dẻo", price: 25000 }
    ],
    isAvailable: true
  },
  {
    name: "Pizza 4 Loại Phô Mai Hoàng Gia (Quattro Formaggi)",
    description: "Sự thăng hoa tuyệt đỉnh của 4 loại phô mai trứ danh: Mozzarella kéo sợi, Cheddar đậm đà, Parmesan thơm bùi và Blue Cheese đặc trưng của ẩm thực Ý.",
    category: "classic",
    price: 169000,
    image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80",
    badge: "Phô Mai Gây Nghiện",
    rating: 4.7,
    spicyLevel: 0,
    sizes: [
      { name: "Nhỏ (20cm)", extraPrice: 0 },
      { name: "Vừa (25cm)", extraPrice: 40000 },
      { name: "Lớn (30cm)", extraPrice: 80000 }
    ],
    crusts: [
      { name: "Đế mỏng giòn rụm", extraPrice: 0 },
      { name: "Đế dày truyền thống xốp mềm", extraPrice: 0 },
      { name: "Đế viền phô mai béo ngậy", extraPrice: 35000 }
    ],
    toppings: [
      { name: "Thêm mật ong hoa rừng rưới kèm", price: 15000 },
      { name: "Thêm phô mai tươi Burrata", price: 45000 }
    ],
    isAvailable: true
  },
  {
    name: "Pizza Gà Nướng Phô Mai Nấm Cay",
    description: "Thịt gà ức phi lê mềm ngọt kết hợp nấm mỡ xào tỏi, ớt chuông xanh, sốt tương ớt cay nhẹ và phô mai nung chảy trên đế bánh nướng củi.",
    category: "meat",
    price: 165000,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
    badge: "Cay Nồng Đậm Đà",
    rating: 4.8,
    spicyLevel: 2,
    sizes: [
      { name: "Nhỏ (20cm)", extraPrice: 0 },
      { name: "Vừa (25cm)", extraPrice: 40000 },
      { name: "Lớn (30cm)", extraPrice: 80000 }
    ],
    crusts: [
      { name: "Đế mỏng giòn rụm", extraPrice: 0 },
      { name: "Đế dày truyền thống xốp mềm", extraPrice: 0 },
      { name: "Đế viền phô mai béo ngậy", extraPrice: 35000 }
    ],
    toppings: [
      { name: "Thêm thịt gà xé cay", price: 25000 },
      { name: "Thêm nấm mỡ tươi", price: 20000 },
      { name: "Thêm phô mai Mozzarella", price: 25000 }
    ],
    isAvailable: true
  },
  {
    name: "Pizza Chay Nấm Hương & Rau Củ Tươi",
    description: "Lựa chọn thanh đạm giàu dinh dưỡng với nấm đùi gà, nấm mỡ, bông cải xanh, cà chua bi mọng nước, ô-liu đen cùng sốt cà chua thảo mộc.",
    category: "vegetarian",
    price: 149000,
    image: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=800&q=80",
    badge: "Món Chay Thanh Lọc",
    rating: 4.6,
    spicyLevel: 0,
    sizes: [
      { name: "Nhỏ (20cm)", extraPrice: 0 },
      { name: "Vừa (25cm)", extraPrice: 35000 },
      { name: "Lớn (30cm)", extraPrice: 70000 }
    ],
    crusts: [
      { name: "Đế mỏng giòn rụm", extraPrice: 0 },
      { name: "Đế ngũ cốc nguyên cám", extraPrice: 15000 },
      { name: "Đế viền phô mai", extraPrice: 35000 }
    ],
    toppings: [
      { name: "Thêm hạt bắp ngọt", price: 10000 },
      { name: "Thêm nấm mỡ tươi", price: 20000 },
      { name: "Thêm quả ô-liu đen", price: 15000 }
    ],
    isAvailable: true
  },
  {
    name: "Pizza Thập Cẩm Siêu Topping (Supreme)",
    description: "Bùng nổ hương vị với xúc xích Pepperoni, giăm bông heo xông khói, thịt bò bằm, nấm tươi, ớt chuông và ô liu đen phủ đầy mặt bánh.",
    category: "meat",
    price: 185000,
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
    badge: "Bán Chạy Nhất",
    rating: 4.9,
    spicyLevel: 1,
    sizes: [
      { name: "Nhỏ (20cm)", extraPrice: 0 },
      { name: "Vừa (25cm)", extraPrice: 40000 },
      { name: "Lớn (30cm)", extraPrice: 85000 }
    ],
    crusts: [
      { name: "Đế mỏng giòn rụm", extraPrice: 0 },
      { name: "Đế dày truyền thống xốp mềm", extraPrice: 0 },
      { name: "Đế viền xúc xích phô mai", extraPrice: 45000 }
    ],
    toppings: [
      { name: "Thêm xúc xích Pepperoni", price: 30000 },
      { name: "Thêm thịt xông khói", price: 30000 },
      { name: "Thêm phô mai Mozzarella dẻo", price: 25000 }
    ],
    isAvailable: true
  },
  {
    name: "Pizza Hawaii Dứa Ngọt & Giăm Bông",
    description: "Sự phối hợp hài hòa giữa những miếng dứa tươi ngọt lịm vùng nhiệt đới và giăm bông thịt heo xông khói cắt lát dày, ăn hoài không ngán.",
    category: "classic",
    price: 155000,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    badge: "Hương Vị Nhiệt Đới",
    rating: 4.7,
    spicyLevel: 0,
    sizes: [
      { name: "Nhỏ (20cm)", extraPrice: 0 },
      { name: "Vừa (25cm)", extraPrice: 40000 },
      { name: "Lớn (30cm)", extraPrice: 80000 }
    ],
    crusts: [
      { name: "Đế mỏng giòn rụm", extraPrice: 0 },
      { name: "Đế dày truyền thống xốp mềm", extraPrice: 0 },
      { name: "Đế viền phô mai béo ngậy", extraPrice: 35000 }
    ],
    toppings: [
      { name: "Thêm dứa tươi", price: 15000 },
      { name: "Thêm giăm bông hun khói", price: 30000 },
      { name: "Thêm phô mai kéo sợi", price: 25000 }
    ],
    isAvailable: true
  }
];
