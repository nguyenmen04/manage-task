# Implementation Plan: Local App Development

Dựa vào yêu cầu dự án `DevOps Task Tracker`, dưới đây là kế hoạch chi tiết để xây dựng ứng dụng chạy trên môi trường local.

## 1. Cấu trúc thư mục (Directory Structure)
Sẽ chia dự án thành 2 phần chính:
- `/backend`: Chứa mã nguồn Node.js (Express).
- `/frontend`: Chứa mã nguồn ReactJS (Vite).
- `/docker-compose.yml`: Dùng để chạy cơ sở dữ liệu PostgreSQL ở môi trường local.

## User Review Required
> [!IMPORTANT]
> **Database Environment:** Để dễ dàng thiết lập và không phải cài đặt PostgreSQL trực tiếp lên máy tính của bạn, tôi đề xuất sử dụng **Docker Compose** để chạy PostgreSQL database (local). Vui lòng xác nhận bạn đã cài đặt Docker Desktop trên Windows chưa? Nếu chưa, bạn có sẵn một database PostgreSQL nào đang chạy không?
> 
> **Frontend Framework:** Tôi sẽ sử dụng ReactJS (khởi tạo bằng Vite) theo như gợi ý của bạn, kết hợp với Vanilla CSS để tối ưu giao diện UI theo phong cách hiện đại. Nếu bạn muốn sử dụng Tailwind CSS, vui lòng cho tôi biết.

## 2. Kế hoạch Triển khai (Proposed Changes)

### 2.1. Thiết lập Database (PostgreSQL)
Tạo file `docker-compose.yml` ở thư mục gốc để khởi tạo DB PostgreSQL nhanh chóng.
- Cấu hình port `5432`.
- Cấu hình các biến môi trường: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- Tạo một file `init.sql` để tạo bảng `tasks` tự động khi DB khởi động.

### 2.2. Xây dựng Backend (Node.js & Express)
- Khởi tạo project trong thư mục `/backend` với các thư viện: `express`, `pg`, `cors`, `dotenv`.
- Cấu trúc:
  - `server.js`: Chứa logic chính, setup Express app và CORS.
  - `db.js`: Quản lý kết nối tới PostgreSQL sử dụng Pool.
  - `.env`: Chứa các biến môi trường cấu hình DB (`DB_HOST`, `DB_USER`, v.v.).
- Viết 4 API endpoints:
  - `GET /tasks`
  - `POST /tasks`
  - `PUT /tasks/:id`
  - `DELETE /tasks/:id`

### 2.3. Xây dựng Frontend (ReactJS)
- Khởi tạo project trong thư mục `/frontend` bằng Vite (React).
- Giao diện người dùng:
  - Sử dụng giao diện đẹp mắt (Gradient, Glassmorphism, Micro-animations) với file `index.css` / `App.css`.
  - Giao diện có: Input field, nút Add, và danh sách Tasks.
  - Mỗi Task có nút Check (đổi trạng thái) và nút Delete.
- Tích hợp gọi API (`fetch`) để liên kết với Backend.

## 3. Verification Plan
- Chạy `docker-compose up -d` để khởi động DB.
- Chạy `npm run dev` ở backend. Kiểm tra kết nối Database.
- Dùng `curl` hoặc kiểm tra log xem Backend có chạy ở port `5000` không.
- Chạy `npm run dev` ở frontend. Truy cập trên trình duyệt, test tính năng thêm/sửa/xoá/hiển thị công việc.
