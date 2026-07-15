# Manage Task - Cloud-Native Microservices Project 🚀

Dự án này là hệ thống Quản lý công việc (Task Tracker) được thiết kế theo chuẩn **DevOps & Cloud-Native**, chia tách kiến trúc nguyên khối (Monolith) thành Microservices và triển khai hoàn toàn tự động lên hạ tầng đám mây Amazon Web Services (AWS).

## 🛠️ Kiến trúc Công nghệ (Tech Stack)

### 1. Application Layer (Microservices)
- **Frontend:** ReactJS + Vite + Tailwind CSS (Đóng gói cùng NGINX).
- **Backend Auth:** Node.js + Express (Quản lý đăng ký, đăng nhập, JWT).
- **Backend Tasks:** Node.js + Express (Quản lý các công việc CRUD).
- **Database:** PostgreSQL 15 (Chạy trên StatefulSet với Persistent Storage).

### 2. DevOps & CI/CD
- **Containerization:** Docker & Docker Compose.
- **CI/CD Pipeline:** GitHub Actions (Tự động chạy Unit Test, Cypress E2E Test, Build & Push Docker Images lên Docker Hub).

### 3. Cloud Infrastructure & Orchestration (AWS)
- **Infrastructure as Code (IaC):** Terraform (Tự động khởi tạo VPC, NAT Gateway, EKS Cluster, EC2 Worker Nodes).
- **Container Orchestration:** Kubernetes (K8s) thông qua Amazon EKS.
- **API Gateway / Routing:** NGINX Ingress Controller.
- **Monitoring:** Prometheus & Grafana (Theo dõi chỉ số CPU, RAM, Log tập trung).

---

## 🏗️ Cấu trúc thư mục dự án

```text
├── backend-auth/       # Microservice quản lý Xác thực
├── backend-tasks/      # Microservice quản lý Công việc
├── frontend/           # Giao diện người dùng (React)
├── k8s/                # Kubernetes Manifests (Cấu hình triển khai K8s)
├── terraform/          # Mã nguồn IaC tạo cụm AWS EKS
├── .github/workflows/  # CI/CD Pipelines (GitHub Actions)
└── docker-compose.yml  # Dùng để chạy thử nghiệm toàn bộ hệ thống dưới Local
```

---

## 🚀 Hướng dẫn khởi chạy

### 1. Chạy dưới Local (Môi trường phát triển)
Chỉ cần cài đặt Docker, mở Terminal ở thư mục gốc và chạy:
```bash
docker-compose up -d --build
```
- Frontend: `http://localhost:5173`
- Backend Auth: `http://localhost:5001`
- Backend Tasks: `http://localhost:5002`

### 2. Triển khai lên Cloud (AWS EKS)
**Bước 1: Khởi tạo hạ tầng AWS bằng Terraform**
```bash
cd terraform
terraform init
terraform apply -auto-approve
```
**Bước 2: Cập nhật kết nối K8s**
```bash
aws eks update-kubeconfig --region ap-southeast-1 --name manage-task-cluster
```
**Bước 3: Triển khai Ứng dụng**
*(Lưu ý: Thay thế `your-dockerhub-username` trong các file `k8s/*.yaml` thành tài khoản Docker Hub của bạn)*
```bash
kubectl apply -f k8s/
```
**Bước 4: Cài đặt hệ thống giám sát (Monitoring)**
```bash
chmod +x k8s/install-monitoring.sh
./k8s/install-monitoring.sh
```

---

## ✨ Sơ đồ Kiến trúc Kubernetes (K8s)

1. **Traffic vào** đi qua `NGINX Ingress Controller`.
2. Dựa vào URL:
   - `/api/auth/*` ➡️ Trỏ vào **Auth Service**.
   - `/api/tasks/*` ➡️ Trỏ vào **Tasks Service**.
   - `/` ➡️ Trỏ vào **Frontend Service**.
3. Các dịch vụ Backend nói chuyện trực tiếp với **PostgreSQL Database** thông qua mạng nội bộ. Dữ liệu DB được bảo toàn bởi `PersistentVolumeClaim`.
