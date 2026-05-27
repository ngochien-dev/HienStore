# 🛍️ HienStore - Modern E-Commerce Platform

> Nền tảng Thương mại điện tử hiện đại dành cho thời trang & phụ kiện — Được xây dựng theo tiêu chuẩn Enterprise-grade Architecture.

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8-blue?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)

---

## 📋 Mục lục (Table of Contents)

- [Tổng quan (Overview)](#tổng-quan-overview)
- [Công nghệ sử dụng (Tech Stack)](#công-nghệ-sử-dụng-tech-stack)
- [Tính năng nổi bật (Key Features)](#tính-năng-nổi-bật-key-features)
- [Kiến trúc hệ thống (Architecture)](#kiến-trúc-hệ-thống-architecture)
- [Hướng dẫn cài đặt (Getting Started)](#hướng-dẫn-cài-đặt-getting-started)
- [Tài liệu API (API Documentation)](#tài-liệu-api-api-documentation)

---

## 🌟 Tổng quan (Overview)

**HienStore** là một ứng dụng Web Thương mại điện tử toàn diện, chuyên biệt cho các mặt hàng thời trang. Dự án mang đến trải nghiệm mua sắm tuyệt vời nhờ giao diện **Glassmorphism** sang trọng, hỗ trợ **Dark Mode**, tích hợp trí tuệ nhân tạo (Gemini AI), hệ thống Nhắn tin Real-time, quản lý Khách hàng thân thiết và Flash Sale chuyên nghiệp.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

### Backend (Core API)
| Công nghệ | Mục đích |
|---|---|
| **Spring Boot 3.3** | REST API framework cốt lõi |
| **Java 21** | Ngôn ngữ lập trình chính (hỗ trợ Virtual Threads) |
| **Spring Security & JWT** | Xác thực & phân quyền bảo mật (Stateless Authentication) |
| **Spring Data JPA** | Tương tác cơ sở dữ liệu (ORM) |
| **MySQL 8** | Hệ quản trị cơ sở dữ liệu quan hệ |
| **WebSocket (STOMP)** | Xử lý tin nhắn Real-time 2 chiều |
| **Spring AI (Gemini 2.0 Flash)**| Trợ lý ảo AI tư vấn mua sắm thông minh |
| **SpringDoc OpenAPI** | Tự động generate tài liệu API (Swagger UI) |
| **MapStruct & Lombok** | Object mapping & giảm thiểu boilerplate code |

### Frontend (Client-side)
| Công nghệ | Mục đích |
|---|---|
| **React 19** | Thư viện UI xây dựng Single Page Application (SPA) |
| **TypeScript** | JavaScript định kiểu tĩnh tĩnh (Type-safe) |
| **Vite** | Công cụ Build & Dev Server siêu tốc |
| **TailwindCSS 4** | Framework CSS tiện ích (Utility-first CSS) |
| **Redux Toolkit** | Quản lý trạng thái toàn cục (State Management) |
| **React Router 7** | Điều hướng ứng dụng (Client-side routing) |
| **Lucide React** | Bộ icon SVG hiện đại, tinh giản |
| **Axios** | HTTP client gọi API chuyên nghiệp |

---

## 🔥 Tính năng nổi bật (Key Features)

### 💎 Trải nghiệm Khách hàng (Customer Experience)
- **Hệ thống Hội viên (Loyalty Program):** Tự động tích điểm sau mỗi đơn hàng, phân hạng thẻ (Đồng, Bạc, Vàng, Kim Cương) và chiết khấu trực tiếp (lên đến 10%) với UI thẻ vật lý sang trọng.
- **Flash Sale & Khuyến mãi:** Cho phép thiết lập "Giá Sale" riêng cho từng biến thể (màu sắc/size), tự động tính toán % giảm giá và hiển thị nhãn (Badge) thu hút.
- **Trợ lý ảo AI (Gemini AI):** Tích hợp Chatbot tư vấn thông minh, phân tích ngôn ngữ tự nhiên để hỗ trợ tìm kiếm sản phẩm.
- **Real-time Chat:** Kênh chat trực tiếp 1-1 giữa Khách hàng và Admin với độ trễ cực thấp (qua WebSocket).
- **Trải nghiệm mua sắm mượt mà:** 
  - Lọc, tìm kiếm sản phẩm theo danh mục, giá cả.
  - Hỗ trợ giỏ hàng đa biến thể (Màu sắc, kích cỡ).
  - Thanh toán linh hoạt (COD, tích hợp VNPay...).
  - Giao diện Dark/Light mode thời thượng.

### 🛡️ Quản trị viên (Admin Panel)
- **Dashboard Thống kê:** Quản lý doanh thu, trạng thái đơn hàng trực quan.
- **Quản lý Sản phẩm Đa tầng:** Quản lý sản phẩm cha và các biến thể (Product Variants) chi tiết về Tồn kho, Giá gốc, Giá Sale, Hình ảnh riêng biệt.
- **Quản lý Đơn hàng:** Xử lý quy trình từ lúc Đặt hàng -> Vận chuyển -> Hoàn thành.
- **Live Support:** Nhận tin nhắn và tư vấn trực tiếp cho khách hàng đang online.

---

## 🏗️ Kiến trúc hệ thống (Architecture)

```text
┌─────────────────┐       ┌─────────────────────────────────────┐
│   Trình duyệt   │       │          Backend (Spring Boot)      │
│ React 19 + TS   │◄─────►│                                     │
│ Vite + Tailwind │       │  Controller → Service → Repository  │
└─────────────────┘       │         │          │                │
                          │         ▼          ▼                │
                          │    ┌────────┐ ┌────────┐            │
                          │    │ Redis* │ │ MySQL 8│            │
                          │    └────────┘ └────────┘            │
                          │                                     │
                          │    WebSocket (STOMP) ◄──► Live Chat │
                          │    Spring AI ◄──► Gemini API        │
                          └─────────────────────────────────────┘
```

---

## 🛠️ Hướng dẫn cài đặt (Getting Started)

### Yêu cầu hệ thống (Prerequisites)
- **Java 21+** (Khuyên dùng JDK 21)
- **Node.js 18+**
- **MySQL 8.0+**
- **Maven 3.8+**

### Các bước triển khai (Manual Setup)

**1. Clone Repository:**
```bash
git clone https://github.com/ngochien-dev/HienStore.git
cd HienStore
```

**2. Cấu hình Backend (Spring Boot):**
- Mở thư mục `backend` bằng IntelliJ IDEA hoặc VS Code.
- Cấu hình file `src/main/resources/application.yml` (Thay đổi Username/Password MySQL).
- Khởi chạy ứng dụng:
```bash
cd backend
mvn spring-boot:run
```
*Backend API sẽ chạy tại: `http://localhost:8080`*

**3. Cấu hình Frontend (ReactJS):**
- Mở Terminal mới, di chuyển vào thư mục `frontend`:
```bash
cd frontend
npm install
npm run dev
```
*Giao diện Web sẽ chạy tại: `http://localhost:5173`*

---

## 📚 Tài liệu API (API Documentation)

Sau khi khởi chạy Backend thành công, toàn bộ tài liệu API chuẩn OpenAPI sẽ có sẵn tại:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

> Cảm ơn bạn đã quan tâm đến HienStore! Mọi ý kiến đóng góp xin vui lòng gửi qua Issues của repository này. 🚀
