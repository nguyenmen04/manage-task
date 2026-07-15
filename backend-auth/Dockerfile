# Sử dụng Node.js bản 20 nhẹ (alpine)
FROM node:20-alpine

# Khai báo thư mục làm việc trong container
WORKDIR /app

# Copy các file quản lý thư viện trước để tận dụng cache
COPY package*.json ./

# Cài đặt các thư viện (chỉ cài dependencies, bỏ qua devDependencies)
RUN npm ci --only=production

# Copy toàn bộ mã nguồn còn lại vào
COPY . .

# Mở cổng 5000
EXPOSE 5000

# Khởi động ứng dụng
CMD ["npm", "start"]
