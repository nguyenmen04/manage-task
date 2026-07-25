# Implementation Plan: Local App Development
# Thêm Công cụ Giám sát (Observability) cho Local Docker Compose

Mục tiêu: Bổ sung hệ thống giám sát (Prometheus & Grafana) vào môi trường chạy Local (Docker Compose) để thay thế cho hệ thống K8s nặng nề, đồng thời cấu hình các dịch vụ Backend để xuất dữ liệu đo lường.

## User Review Required
> [!IMPORTANT]
> Thay đổi này sẽ yêu cầu khởi động lại toàn bộ hệ thống bằng Docker Compose và cài thêm thư viện vào mã nguồn Node.js. Bạn vui lòng xem qua kế hoạch để xác nhận nhé!

## Proposed Changes

### 1. Cấu trúc lại file Docker Compose
#### [MODIFY] [docker-compose.yml](file:///c:/Users/ADMIN/OneDrive/Desktop/mini-project/manage-task/docker-compose.yml)
- Thêm dịch vụ `prometheus` (thu thập dữ liệu).
- Thêm dịch vụ `grafana` (trực quan hóa dữ liệu bằng biểu đồ).

### 2. Cấu hình Prometheus & Grafana
#### [NEW] `prometheus/prometheus.yml`
- File cấu hình để Prometheus biết cần phải quét dữ liệu (scrape) từ 2 backend (`backend-auth` và `backend-tasks`) mỗi 15 giây.

### 3. Cập nhật mã nguồn Backend (Auth & Tasks)
Để Prometheus có thể thu thập được dữ liệu, các ứng dụng Node.js cần phải mở một cổng giao tiếp `/metrics`.
#### [MODIFY] [backend-auth/package.json](file:///c:/Users/ADMIN/OneDrive/Desktop/mini-project/manage-task/backend-auth/package.json) và [backend-tasks/package.json](file:///c:/Users/ADMIN/OneDrive/Desktop/mini-project/manage-task/backend-tasks/package.json)
- Bổ sung thư viện `prom-client` và `express-prom-bundle`.
#### [MODIFY] [backend-auth/server.js](file:///c:/Users/ADMIN/OneDrive/Desktop/mini-project/manage-task/backend-auth/server.js) và [backend-tasks/server.js](file:///c:/Users/ADMIN/OneDrive/Desktop/mini-project/manage-task/backend-tasks/server.js)
- Chèn middleware để tự động thu thập thông tin về Request HTTP, CPU, RAM và mở API `/metrics`.

## Verification Plan
1. Chạy lệnh `docker-compose down` và `docker-compose up -d --build`.
2. Kiểm tra truy cập **Prometheus** tại `http://localhost:9090`.
3. Kiểm tra truy cập **Grafana** tại `http://localhost:3001`.
4. Gọi thử API của Backend và xem biểu đồ trên Grafana nhảy dữ liệu.
- Giao diện người dùng:
  - Sử dụng giao diện đẹp mắt (Gradient, Glassmorphism, Micro-animations) với file `index.css` / `App.css`.
  - Giao diện có: Input field, nút Add, và danh sách Tasks.
  - Mỗi Task có nút Check (đổi trạng thái) và nút Delete.
## 3. Verification Plan
- Chạy `docker-compose up -d` để khởi động DB.
- Chạy `npm run dev` ở backend. Kiểm tra kết nối Database.
- Dùng `curl` hoặc kiểm tra log xem Backend có chạy ở port `5000` không.
- Chạy `npm run dev` ở frontend. Truy cập trên trình duyệt, test tính năng thêm/sửa/xoá/hiển thị công việc.
