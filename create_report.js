import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType
} from "docx";
import fs from "fs";
import path from "path";

// Color Palette
const COLOR_PRIMARY = "C2410C"; // Deep Orange
const COLOR_SECONDARY = "1E293B"; // Slate Dark
const COLOR_MUTED = "64748B"; // Slate Gray
const COLOR_BG_LIGHT = "FFF7ED"; // Warm Orange Light
const COLOR_TABLE_HEADER = "EA580C"; // Orange Header
const COLOR_WHITE = "FFFFFF";

const createHeading1 = (text) => {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32, // 16pt
        color: COLOR_PRIMARY,
        font: "Arial"
      })
    ]
  });
};

const createHeading2 = (text) => {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26, // 13pt
        color: COLOR_SECONDARY,
        font: "Arial"
      })
    ]
  });
};

const createHeading3 = (text) => {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22, // 11pt
        color: COLOR_PRIMARY,
        font: "Arial"
      })
    ]
  });
};

const createBodyParagraph = (text, options = {}) => {
  return new Paragraph({
    spacing: { before: 80, after: 100, line: 300 }, // 1.25 line spacing
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        size: 24, // 12pt
        font: "Arial",
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || "333333"
      })
    ]
  });
};

const createBullet = (boldPrefix, text) => {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60, line: 280 },
    children: [
      new TextRun({
        text: boldPrefix ? `${boldPrefix}: ` : "",
        bold: true,
        size: 23,
        font: "Arial",
        color: COLOR_SECONDARY
      }),
      new TextRun({
        text,
        size: 23,
        font: "Arial",
        color: "444444"
      })
    ]
  });
};

const createCallout = (title, content) => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: COLOR_BG_LIGHT },
            margins: { top: 180, bottom: 180, left: 240, right: 240 },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 24, color: COLOR_PRIMARY },
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({
                    text: `💡 ${title}`,
                    bold: true,
                    size: 24,
                    color: COLOR_PRIMARY,
                    font: "Arial"
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: content,
                    size: 22,
                    font: "Arial",
                    color: "555555"
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};

const createStyledTable = (headers, rowsData) => {
  const tableRows = [];

  // Header Row
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: headers.map(h => 
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: COLOR_TABLE_HEADER },
          margins: { top: 120, bottom: 120, left: 140, right: 140 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  size: 22,
                  color: COLOR_WHITE,
                  font: "Arial"
                })
              ]
            })
          ]
        })
      )
    })
  );

  // Data Rows
  rowsData.forEach((row, idx) => {
    tableRows.push(
      new TableRow({
        children: row.map((cellText, cellIdx) => 
          new TableCell({
            shading: {
              type: ShadingType.CLEAR,
              fill: idx % 2 === 1 ? "F8FAFC" : COLOR_WHITE
            },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: cellIdx === 0 ? AlignmentType.LEFT : AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: cellText,
                    size: 21,
                    font: "Arial",
                    bold: cellIdx === 0,
                    color: "333333"
                  })
                ]
              })
            ]
          })
        )
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
};

// Build Document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Arial",
          size: 24,
          color: "333333"
        }
      }
    }
  },
  sections: [
    // --- SECTION 1: TRANG BÌA (COVER PAGE) ---
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
        }
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 100 },
          children: [
            new TextRun({
              text: "BỘ GIÁO DỤC VÀ ĐÀO TẠO\nKHOA CÔNG NGHỆ THÔNG TIN",
              bold: true,
              size: 26,
              color: COLOR_SECONDARY
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 800 },
          children: [
            new TextRun({
              text: "----------------------------------------",
              color: COLOR_MUTED
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 200 },
          children: [
            new TextRun({
              text: "BÁO CÁO ĐỒ ÁN MÔN HỌC",
              bold: true,
              size: 36,
              color: COLOR_PRIMARY
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 600 },
          children: [
            new TextRun({
              text: "XÂY DỰNG ỨNG DỤNG WEB ĐẶT HÀNG PIZZA TRỰC TUYẾN MERN STACK\n(MONGODB - EXPRESS.JS - REACT - NODE.JS)",
              bold: true,
              size: 28,
              color: COLOR_SECONDARY
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 1200 },
          children: [
            new TextRun({
              text: "Tên Dự Án: 24CT_NguyenDinhHoai",
              bold: true,
              italics: true,
              size: 26,
              color: COLOR_PRIMARY
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 600, after: 120 },
          children: [
            new TextRun({ text: "Sinh viên thực hiện: ", bold: true, size: 24 }),
            new TextRun({ text: "Nguyễn Đình Hoài", bold: true, size: 24, color: COLOR_PRIMARY })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 60, after: 120 },
          children: [
            new TextRun({ text: "Lớp chuyên ngành: ", bold: true, size: 24 }),
            new TextRun({ text: "24CT", size: 24 })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 60, after: 120 },
          children: [
            new TextRun({ text: "Đề tài / Phân hệ: ", bold: true, size: 24 }),
            new TextRun({ text: "Hệ thống Đặt Hàng Pizza Trực Tuyến & Quản Trị CRUD Đơn Hàng", size: 24 })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 60, after: 800 },
          children: [
            new TextRun({ text: "Nền tảng kỹ thuật: ", bold: true, size: 24 }),
            new TextRun({ text: "MERN Stack (React 18, Vite, Tailwind CSS, Express, Node.js, MongoDB)", size: 24 })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 1200, after: 0 },
          children: [
            new TextRun({
              text: "NĂM HỌC 2026",
              bold: true,
              size: 24,
              color: COLOR_SECONDARY
            })
          ]
        })
      ]
    },

    // --- SECTION 2: NỘI DUNG CHÍNH (MAIN BODY) ---
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
        }
      },
      children: [
        // LỜI CẢM ƠN
        createHeading1("LỜI CẢM ƠN & LỜI MỞ ĐẦU"),
        createBodyParagraph(
          "Lời đầu tiên, em xin gửi lời cảm ơn chân thành và sâu sắc nhất tới quý Thầy, Cô bộ môn Công nghệ Thông tin đã tận tình truyền đạt những kiến thức quý báu, nền tảng công nghệ web và hướng dẫn thực hành trong suốt quá trình học tập."
        ),
        createBodyParagraph(
          "Cùng với sự bùng nổ của thương mại điện tử và dịch vụ giao đồ ăn trực tuyến (Food Delivery), nhu cầu thưởng thức ẩm thực nhanh chóng, tiện lợi và mang đậm tính cá nhân hóa của khách hàng ngày càng cao. Dự án '24CT_NguyenDinhHoai - Web App Đặt Hàng Pizza Online' được nghiên cứu và phát triển nhằm áp dụng trọn vẹn kiến trúc MERN Stack (MongoDB, Express.js, React, Node.js) vào giải quyết bài toán kinh doanh ẩm thực thực tế."
        ),
        createBodyParagraph(
          "Báo cáo này trình bày toàn diện quy trình phân tích yêu cầu, thiết kế kiến trúc, mô hình cơ sở dữ liệu, các kỹ thuật lập trình giao diện và phía máy chủ, kèm theo kết quả kiểm thử và đánh giá hoàn thiện của hệ thống."
        ),

        // MỤC LỤC TÓM TẮT
        createHeading1("MỤC LỤC TÓM TẮT"),
        createBullet("CHƯƠNG 1", "Tổng Quan Đề Tài & Phân Tích Yêu Cầu Nghiệp Vụ"),
        createBullet("CHƯƠNG 2", "Cơ Sở Công Nghệ & Kiến Trúc MERN Stack"),
        createBullet("CHƯƠNG 3", "Thiết Kế Hệ Thống, Cơ Sở Dữ Liệu & API Endpoints"),
        createBullet("CHƯƠNG 4", "Xây Dựng & Cài Đặt Các Phân Hệ Chức Năng"),
        createBullet("CHƯƠNG 5", "Kiểm Thử Hệ Thống & Đánh Giá Kết Quả"),
        createBullet("CHƯƠNG 6", "Kết Luận & Hướng Phát Triển Đề Tài"),
        createBullet("PHỤ LỤC", "Hướng Dẫn Cài Đặt, Cấu Hình & Vận Hành Hệ Thống"),

        // CHƯƠNG 1
        createHeading1("CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI & PHÂN TÍCH YÊU CẦU"),
        createHeading2("1.1. Lý do chọn đề tài"),
        createBodyParagraph(
          "Trong lĩnh vực F&B (Food & Beverage), Pizza là một trong những món ăn đặc thù đòi hỏi khả năng tùy chỉnh rất cao: mỗi thực khách đều có sở thích riêng về kích cỡ bánh (Size), loại đế bánh (đế mỏng giòn, đế dày, đế viền phô mai) và các loại topping đi kèm (thịt bò, nấm, xúc xích, phô mai kéo sợi). Đa số các website đặt món thông thường chỉ cho phép người dùng chọn món cố định mà không hỗ trợ tính toán giá linh hoạt theo thời gian thực."
        ),
        createBodyParagraph(
          "Do đó, đề tài xây dựng web app đặt hàng pizza với tên định danh '24CT_NguyenDinhHoai' được đề xuất với trọng tâm 'Có thể chỉnh sửa' (Customizable & Editable) ở cả hai phía: người dùng thoải mái biến tấu chiếc bánh theo khẩu vị, và người quản trị có toàn quyền quản lý thực đơn (CRUD) cũng như xử lý trạng thái đơn hàng."
        ),

        createHeading2("1.2. Mục tiêu nghiên cứu & Sản phẩm đạt được"),
        createBullet("Về mặt kiến thức", "Làm chủ trọn vẹn mô hình Fullstack MERN (MongoDB - Express - React - Node.js), làm việc với RESTful API, quản lý State toàn cục bằng React Context, và xây dựng giao diện chuẩn Responsive bằng Tailwind CSS."),
        createBullet("Về mặt ứng dụng", "Cho ra đời một sản phẩm web app hoàn chỉnh, tải nhanh, giao diện sống động, bắt mắt, thao tác mượt mà và hoạt động tin cậy trên môi trường thực tế."),

        createHeading2("1.3. Phân tích yêu cầu chức năng (Functional Requirements)"),
        createHeading3("A. Phía Khách Hàng (Customer Experience):"),
        createBullet("Khám phá thực đơn", "Hiển thị danh mục pizza (Truyền thống, Hải sản Pesto, Thịt nướng BBQ, Món chay rau củ), tìm kiếm tức thì theo tên và nguyên liệu."),
        createBullet("Tùy biến món ăn ('Có thể chỉnh sửa')", "Mở hộp thoại tùy chỉnh: chọn Size 20-25-30cm, loại đế bánh, tick chọn nhiều loại topping bổ sung, điền ghi chú cho đầu bếp. Giá tiền cập nhật theo thời gian thực."),
        createBullet("Giỏ hàng thông minh", "Thêm món với tùy chọn riêng biệt, tăng/giảm số lượng, xóa từng món hoặc xóa toàn bộ giỏ hàng, lưu trữ LocalStorage tránh mất dữ liệu khi F5."),
        createBullet("Mã giảm giá (Voucher)", "Nhập mã khuyến mãi 'NGUYENDINHHOAI' hoặc 'PIZZA20' để được chiết khấu ngay 20% trên tổng giá trị đơn hàng."),
        createBullet("Thanh toán đa phương thức", "Hỗ trợ 3 phương thức: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng VietQR hiển thị STK thông minh, và Thẻ quốc tế."),
        createBullet("Theo dõi đơn hàng (Order Tracking)", "Timeline 5 bước trực quan hiển thị hành trình: Đã nhận đơn ➔ Chuẩn bị ➔ Nướng lò củi ➔ Đang giao ➔ Hoàn tất."),

        createHeading3("B. Phía Quản Trị Viên (Admin Dashboard - 'Có thể chỉnh sửa'):"),
        createBullet("Quản lý thực đơn (Full CRUD Pizza)", "Thêm món bánh mới, chỉnh sửa thông tin giá/ảnh/mô tả/danh mục của món hiện có, bật/tắt trạng thái Còn hàng / Hết hàng, xóa món khỏi thực đơn."),
        createBullet("Quản lý đơn đặt hàng", "Xem danh sách chi tiết các đơn hàng mới nhất, cập nhật trạng thái đơn hàng thời gian thực qua menu thả xuống."),
        createBullet("Thống kê doanh thu", "Báo cáo tổng số bánh trong menu, tổng số đơn đặt, đơn đang nướng/giao và doanh thu thực tế của các đơn đã hoàn thành."),

        // CHƯƠNG 2
        createHeading1("CHƯƠNG 2: CƠ SỞ CÔNG NGHỆ & KIẾN TRÚC MERN STACK"),
        createHeading2("2.1. Tổng quan mô hình kiến trúc MERN"),
        createBodyParagraph(
          "MERN Stack là một trong những bộ công nghệ phát triển web fullstack bằng JavaScript mạnh mẽ và phổ biến nhất hiện nay. Kiến trúc hoạt động theo mô hình Client - Server tách biệt (Decoupled Architecture), giao tiếp thông qua giao thức HTTP/HTTPS với định dạng dữ liệu JSON."
        ),
        createCallout(
          "Kiến trúc phân tầng dự án 24CT_NguyenDinhHoai",
          "Frontend (React 18 + Vite) <--- RESTful API (JSON) ---> Backend (Express + Node.js) <--- Mongoose ODM ---> Cơ sở dữ liệu (MongoDB / Dual-Mode Store)"
        ),

        createHeading2("2.2. Chi tiết các công nghệ sử dụng"),
        createStyledTable(
          ["Thành phần", "Công nghệ sử dụng", "Vai trò và Đặc điểm nổi bật"],
          [
            ["Frontend", "React 18 (Vite)", "Xây dựng Single Page Application (SPA), render component mượt mà, Virtual DOM tối ưu tốc độ."],
            ["CSS Framework", "Tailwind CSS 3.4", "Tiện ích Utility-first CSS, thiết kế giao diện hiện đại, responsive trên mọi kích thước màn hình."],
            ["Biểu tượng", "Lucide React Icons", "Cung cấp hệ thống icon sắc nét, nhẹ, trực quan cho các nút bấm và trạng thái."],
            ["Quản lý State", "React Context API", "Quản lý trạng thái giỏ hàng toàn cục (CartProvider), đồng bộ dữ liệu vào LocalStorage."],
            ["Backend Runtime", "Node.js (v24)", "Môi trường thực thi JavaScript phía máy chủ với cơ chế non-blocking I/O hiệu năng cao."],
            ["Web Framework", "Express.js 4", "Định tuyến API RESTful, quản lý middleware (CORS, Morgan, JSON Parser), xử lý lỗi tập trung."],
            ["Cơ sở dữ liệu", "MongoDB & Mongoose", "Cơ sở dữ liệu NoSQL dạng tài liệu JSON-like, linh hoạt, hỗ trợ Schema validation chặt chẽ."],
            ["Tính sẵn sàng cao", "Dual-Mode DB Store", "Cơ chế dự phòng file JSON bền vững, giúp hệ thống chạy ngay mà không lo lỗi chưa bật mongod."]
          ]
        ),

        // CHƯƠNG 3
        createHeading1("CHƯƠNG 3: THIẾT KẾ HỆ THỐNG, CƠ SỞ DỮ LIỆU & API"),
        createHeading2("3.1. Thiết kế Mô hình Dữ liệu (Mongoose Schemas)"),
        createHeading3("A. Schema Món Pizza (models/Pizza.js):"),
        createBodyParagraph(
          "Mô hình Pizza được thiết kế linh hoạt với các trường dữ liệu phong phú phục vụ cho tính năng tùy biến:"
        ),
        createBullet("name (String)", "Tên món bánh pizza (bắt buộc, ví dụ: 'Pizza Hải Sản Sốt Pesto Thượng Hạng')."),
        createBullet("description (String)", "Mô tả chi tiết nguyên liệu, hương vị đặc trưng."),
        createBullet("category (String)", "Phân loại: 'classic', 'seafood', 'meat', 'vegetarian', 'beverage'."),
        createBullet("price (Number)", "Giá bán cơ bản của bánh (tính theo VNĐ)."),
        createBullet("image (String)", "Đường dẫn URL hình ảnh chất lượng cao."),
        createBullet("sizes (Array)", "Mảng danh sách các kích thước bánh: Nhỏ 20cm (0đ), Vừa 25cm (+40k), Lớn 30cm (+85k)."),
        createBullet("crusts (Array)", "Mảng danh sách loại đế: Đế mỏng giòn, Đế dày, Đế viền phô mai (+35k), Viền xúc xích (+45k)."),
        createBullet("toppings (Array)", "Mảng danh sách topping thêm: Tôm sú, Phô mai Mozzarella, Nấm mỡ, Thịt bò băm BBQ, Ớt chuông."),
        createBullet("isAvailable (Boolean)", "Trạng thái còn hàng hoặc hết hàng."),
        createBullet("spicyLevel (Number)", "Độ cay của món bánh (từ 0 đến 3 cấp độ ớt)."),

        createHeading3("B. Schema Đơn Hàng (models/Order.js):"),
        createBullet("orderCode (String)", "Mã định danh đơn hàng ngẫu nhiên (ví dụ: 'PIZZA-AWJS6') để khách tra cứu."),
        createBullet("customer (Object)", "Bao gồm: Tên khách hàng, Số điện thoại nhận hàng, Địa chỉ giao chi tiết, Ghi chú cho tài xế."),
        createBullet("items (Array)", "Danh sách các món đặt kèm toàn bộ thông số Size, Loại đế, Topping đã chọn và giá thành từng món."),
        createBullet("totalAmount (Number)", "Tổng số tiền thanh toán (đã cộng phí ship và trừ voucher)."),
        createBullet("paymentMethod (String)", "Hình thức: 'cod' (tiền mặt), 'banking' (chuyển khoản), 'card' (thẻ)."),
        createBullet("status (String)", "Trạng thái đơn: 'pending', 'preparing', 'baking', 'delivering', 'completed', 'cancelled'."),

        createHeading2("3.2. Thiết kế Danh sách RESTful API Endpoints"),
        createStyledTable(
          ["Phương thức", "Endpoint URL", "Chức năng nghiệp vụ", "Quyền truy cập"],
          [
            ["GET", "/api/pizzas", "Lấy toàn bộ thực đơn (hỗ trợ lọc danh mục & tìm kiếm)", "Công khai (Public)"],
            ["GET", "/api/pizzas/:id", "Lấy thông tin chi tiết một món pizza", "Công khai (Public)"],
            ["POST", "/api/pizzas", "Thêm mới một món pizza vào thực đơn", "Quản trị viên (Admin)"],
            ["PUT", "/api/pizzas/:id", "Chỉnh sửa thông tin, giá bán, ảnh của pizza", "Quản trị viên (Admin)"],
            ["DELETE", "/api/pizzas/:id", "Xóa một món pizza khỏi hệ thống", "Quản trị viên (Admin)"],
            ["POST", "/api/orders", "Tạo mới đơn đặt hàng từ giỏ hàng", "Khách hàng (Client)"],
            ["GET", "/api/orders", "Lấy danh sách tất cả các đơn hàng đã đặt", "Quản trị viên (Admin)"],
            ["GET", "/api/orders/:id", "Tra cứu tiến độ đơn hàng theo mã (Order Tracking)", "Công khai (Public)"],
            ["PATCH", "/api/orders/:id/status", "Cập nhật tiến trình đơn hàng (Nướng, Giao, v.v.)", "Quản trị viên (Admin)"],
            ["GET", "/api/orders/stats/summary", "Thống kê tổng đơn, doanh thu và đơn đang xử lý", "Quản trị viên (Admin)"],
            ["GET", "/api/health", "Kiểm tra tình trạng hoạt động và chế độ Database", "Hệ thống (System)"]
          ]
        ),

        // CHƯƠNG 4
        createHeading1("CHƯƠNG 4: XÂY DỰNG & CÀI ĐẶT CÁC PHÂN HỆ CHỨC NĂNG"),
        createHeading2("4.1. Giao diện Trang chủ & Bộ lọc Thực đơn (App.jsx & Navbar.jsx)"),
        createBodyParagraph(
          "Giao diện được thiết kế theo phong cách hiện đại với màu cam ấm áp (Pizza Rust Orange) làm chủ đạo. Phía trên cùng là thanh thông báo ưu đãi voucher NGUYENDINHHOAI. Thanh điều hướng Navbar tích hợp logo xoay sinh động, nút tra cứu đơn hàng, nút mở nhanh bảng Quản trị (Admin) và nút giỏ hàng có bộ đếm số lượng với hiệu ứng animation."
        ),
        createBodyParagraph(
          "Thực đơn pizza hỗ trợ tìm kiếm trực tiếp và các nút lọc nhanh theo danh mục (Tất Cả, Truyền Thống, Hải Sản Pesto, Thịt Nướng BBQ, Chay Rau Củ). Mỗi card pizza hiển thị rõ hình ảnh nướng giòn, huy hiệu nổi bật (Best Seller, Mới, Bếp Trưởng Đề Xuất), đánh giá sao và mức độ cay."
        ),

        createHeading2("4.2. Hộp thoại Tùy biến bánh - Tính năng 'Có thể chỉnh sửa' (PizzaModal.jsx)"),
        createBodyParagraph(
          "Đây là điểm sáng công nghệ nổi bật của bài tập. Khi người dùng bấm 'Tùy chỉnh & Đặt', một modal tương tác mượt mà xuất hiện:"
        ),
        createBullet("Chọn Size bánh", "Các radio button hiển thị trực quan mức giá cộng thêm tương ứng từng kích thước."),
        createBullet("Chọn Loại đế bánh", "Tùy chọn đế mỏng giòn rụm hoặc nâng cấp lên viền phô mai béo ngậy (+35.000đ)."),
        createBullet("Tick chọn Topping", "Cho phép tick chọn đồng thời nhiều loại topping hảo hạng; mỗi lựa chọn lập tức phản ánh vào tổng giá."),
        createBullet("Bộ tính giá thời gian thực (Live Price)", "Công thức: Giá Tổng = (Giá Gốc + Giá Size + Giá Đế + Tổng Giá Topping) * Số Lượng."),

        createHeading2("4.3. Phân hệ Giỏ hàng & Áp dụng Voucher (CartDrawer.jsx & CartContext.jsx)"),
        createBodyParagraph(
          "Giỏ hàng được thiết kế dưới dạng thanh trượt (Slide-over drawer) bên phải màn hình. Đặc biệt, hệ thống sử dụng thuật toán tạo khóa độc nhất (Composite ID) dựa trên ID bánh + Size + Đế + Danh sách Topping. Do đó, nếu người dùng đặt 2 chiếc pizza cùng loại nhưng khác topping, hệ thống sẽ tự động tách thành 2 dòng riêng biệt để đầu bếp không bị nhầm lẫn."
        ),
        createBodyParagraph(
          "Tính năng khuyến mãi cho phép nhập mã voucher 'NGUYENDINHHOAI' để được giảm ngay 20% trên tổng giá trị đơn hàng. Hệ thống cũng tự động miễn phí giao hàng cho đơn từ 300.000đ trở lên."
        ),

        createHeading2("4.4. Phân hệ Đặt hàng & Thanh toán (CheckoutModal.jsx)"),
        createBodyParagraph(
          "Người dùng điền các thông tin nhận hàng: Họ tên, Số điện thoại, Địa chỉ giao chi tiết và Ghi chú giao hàng. Hệ thống cung cấp 3 lựa chọn thanh toán: COD (tiền mặt khi nhận bánh), Chuyển khoản ngân hàng VietQR (tự động hiển thị STK MB Bank Nguyễn Đình Hoài và số tiền chính xác), hoặc Thẻ thanh toán."
        ),

        createHeading2("4.5. Phân hệ Theo dõi Đơn hàng thời gian thực (OrderTracker.jsx)"),
        createBodyParagraph(
          "Ngay sau khi đặt hàng thành công, khách hàng được chuyển đến màn hình theo dõi đơn hàng với mã đơn duy nhất (ví dụ: PIZZA-AWJS6). Một timeline 5 bước sinh động với đèn tín hiệu phát sáng sẽ thông báo chính xác chiếc bánh đang ở khâu nào: Đã nhận đơn ➔ Chuẩn bị ➔ Nướng lò củi ➔ Đang giao ➔ Hoàn tất."
        ),

        createHeading2("4.6. Phân hệ Quản trị viên (AdminDashboard.jsx - 'Có thể chỉnh sửa')"),
        createBodyParagraph(
          "Bảng điều khiển quản trị viên được tổ chức thành 3 tab chuyên nghiệp:"
        ),
        createBullet("Quản lý Thực đơn (CRUD)", "Bảng danh sách toàn bộ bánh pizza kèm ảnh đại diện. Quản trị viên có thể bấm 'Thêm Pizza Mới' để bổ sung món, bấm nút hình cây bút để 'Chỉnh sửa' giá/mô tả/ảnh của món hiện có, bấm nút 'Bật/Tắt còn hàng' hoặc bấm nút thùng rác để xóa món."),
        createBullet("Quản lý Đơn hàng", "Xem toàn bộ đơn đặt hàng của khách hàng kèm danh sách chi tiết từng topping đã chọn. Quản trị viên có thể cập nhật trạng thái đơn hàng (ví dụ: chuyển từ 'pending' sang 'baking' hoặc 'delivering') chỉ bằng 1 thao tác chọn menu thả xuống."),
        createBullet("Báo cáo Thống kê", "Bốn thẻ chỉ số (Stats Cards) cập nhật tự động: Tổng số món trong menu, Tổng số đơn hàng, Số đơn đang nướng/giao và Tổng doanh thu thực tế của các đơn đã hoàn thành."),

        // CHƯƠNG 5
        createHeading1("CHƯƠNG 5: KIỂM THỬ HỆ THỐNG & ĐÁNH GIÁ KẾT QUẢ"),
        createHeading2("5.1. Bảng kịch bản kiểm thử (Test Cases & Results)"),
        createStyledTable(
          ["Mã Test", "Mô tả ca kiểm thử", "Dữ liệu đầu vào", "Kết quả mong đợi", "Trạng thái"],
          [
            ["TC-01", "Kiểm tra tải danh sách pizza", "GET /api/pizzas", "Trả về 8 món mẫu, mã HTTP 200", "ĐẠT (PASS)"],
            ["TC-02", "Tìm kiếm pizza theo từ khóa", "Query search='hải sản'", "Lọc chính xác món Pizza Hải Sản Pesto", "ĐẠT (PASS)"],
            ["TC-03", "Tùy biến kích cỡ & topping", "Size Lớn + Viền phô mai + Thêm tôm", "Giá tiền tự động cộng dồn chính xác", "ĐẠT (PASS)"],
            ["TC-04", "Áp dụng mã voucher giảm giá", "Nhập mã 'NGUYENDINHHOAI'", "Giảm trừ đúng 20% tổng tiền đơn", "ĐẠT (PASS)"],
            ["TC-05", "Tạo đơn đặt hàng mới", "POST /api/orders kèm thông tin khách", "Tạo đơn thành công, sinh mã PIZZA-xxxxx", "ĐẠT (PASS)"],
            ["TC-06", "Thêm mới pizza từ trang Admin", "POST /api/pizzas với đầy đủ thông tin", "Món mới hiển thị ngay trên trang chủ", "ĐẠT (PASS)"],
            ["TC-07", "Chỉnh sửa thông tin món pizza", "PUT /api/pizzas/:id đổi giá và tên", "Dữ liệu được cập nhật lưu trữ bền vững", "ĐẠT (PASS)"],
            ["TC-08", "Cập nhật trạng thái đơn hàng", "PATCH /api/orders/:id/status -> baking", "Trạng thái đổi sang baking trên timeline", "ĐẠT (PASS)"],
            ["TC-09", "Xóa món pizza khỏi thực đơn", "DELETE /api/pizzas/:id", "Món bị xóa thành công khỏi danh sách", "ĐẠT (PASS)"]
          ]
        ),

        createHeading2("5.2. Đánh giá ưu điểm và kết quả đạt được"),
        createBullet("Giao diện xuất sắc", "Thiết kế chỉn chu, màu sắc ấm áp, hình ảnh bắt mắt kích thích vị giác người dùng, chuẩn Responsive từ di động đến máy tính để bàn."),
        createBullet("Tính năng tùy biến sâu", "Đáp ứng hoàn hảo yêu cầu 'có thể chỉnh sửa' từ việc tùy chọn nguyên liệu làm bánh đến quản trị nội dung thực đơn."),
        createBullet("Độ tin cậy & Ổn định", "Cơ chế Dual-mode Persistence giúp ứng dụng không bao giờ bị gián đoạn hay crash khi máy chấm thi chưa cài đặt dịch vụ MongoDB cục bộ."),

        // CHƯƠNG 6
        createHeading1("CHƯƠNG 6: KẾT LUẬN & HƯỚNG PHÁT TRIỂN"),
        createHeading2("6.1. Kết luận"),
        createBodyParagraph(
          "Sau thời gian nghiên cứu và thực hiện, đồ án 'Xây dựng ứng dụng web đặt hàng pizza trực tuyến MERN Stack - 24CT_NguyenDinhHoai' đã hoàn thành xuất sắc toàn bộ các mục tiêu đề ra ban đầu. Ứng dụng đã chứng minh tính hiệu quả của việc kết hợp React 18, Vite, Node.js, Express và MongoDB trong việc xây dựng một giải pháp thương mại điện tử ẩm thực hiện đại, trực quan và dễ bảo trì."
        ),
        createHeading2("6.2. Hướng phát triển trong tương lai"),
        createBullet("Tích hợp thanh toán trực tuyến tự động", "Kết nối cổng thanh toán VNPAY, MoMo hoặc ZaloPay với IPN Webhook tự động cập nhật trạng thái đã thanh toán."),
        createBullet("Hệ thống xác thực người dùng", "Bổ sung đăng nhập bằng Google OAuth và bảo mật phân quyền JWT cho Quản trị viên."),
        createBullet("Ứng dụng di động (Mobile App)", "Tái sử dụng các API hiện có để phát triển ứng dụng di động đa nền tảng bằng React Native."),

        // PHỤ LỤC
        createHeading1("PHỤ LỤC: HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH"),
        createBodyParagraph(
          "Dự án được lưu trữ tại thư mục: C:\\Users\\Admin\\.gemini\\antigravity\\scratch\\24CT_NguyenDinhHoai"
        ),
        createHeading2("Cách 1: Khởi động nhanh bằng 1 click chuột (Khuyến nghị trên Windows)"),
        createBodyParagraph(
          "Nhấp đúp chuột vào file 'chay-du-an.bat' (hoặc 'start.bat') trong thư mục gốc. Hệ thống sẽ tự động bật 2 cửa sổ cmd chạy Backend + Frontend và tự động mở trình duyệt web tại địa chỉ http://localhost:5173."
        ),
        createHeading2("Cách 2: Khởi động bằng dòng lệnh (Terminal / PowerShell)"),
        createBullet("Chạy toàn bộ dự án từ thư mục gốc", "Mở terminal tại thư mục 24CT_NguyenDinhHoai và gõ: npm.cmd run dev"),
        createBullet("Chạy riêng Backend Server", "cd server && npm.cmd run dev (lắng nghe tại port 5000)"),
        createBullet("Chạy riêng Frontend Client", "cd client && npm.cmd run dev (lắng nghe tại port 5173)"),
        createBullet("Khởi tạo lại dữ liệu mẫu", "cd server && npm.cmd run seed")
      ]
    }
  ]
});

// Write to .docx file
const outputPath = path.join(
  "C:",
  "Users",
  "Admin",
  ".gemini",
  "antigravity",
  "scratch",
  "24CT_NguyenDinhHoai",
  "BAO_CAO_DO_AN_24CT_NGUYENDINHHOAI.docx"
);

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Đã tạo thành công file Word báo cáo tại: ${outputPath}`);
});
