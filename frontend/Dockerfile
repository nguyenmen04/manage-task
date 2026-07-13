# ==========================================
# BƯỚC 1: Build file tĩnh (HTML, CSS, JS)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Lấy thông tin thư viện
COPY package*.json ./
# Cài đặt toàn bộ thư viện (bao gồm cả devDependencies để build)
RUN npm ci

# Copy toàn bộ source code React
COPY . .

# Chạy lệnh build của Vite để biên dịch code ra thư mục /dist
RUN npm run build

# ==========================================
# BƯỚC 2: Phục vụ file bằng Nginx Server
# ==========================================
FROM nginx:alpine

# Xóa các file mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Lấy thành quả (thư mục dist) từ Bước 1 sang thư mục html của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Chép đè cấu hình Nginx do ta tự định nghĩa vào trong container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Phơi bày port 80 cho bên ngoài
EXPOSE 80

# Chạy Nginx liên tục (daemon off)
CMD ["nginx", "-g", "daemon off;"]
