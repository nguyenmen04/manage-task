#!/bin/bash
# Kịch bản cài đặt tự động Hệ thống giám sát (Prometheus & Grafana) cho Kubernetes
# Yêu cầu: Đã cài đặt Helm (https://helm.sh/docs/intro/install/)

echo "1. Thêm kho lưu trữ của cộng đồng Prometheus..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

echo "2. Khởi tạo không gian riêng (Namespace) cho hệ thống giám sát..."
kubectl create namespace monitoring

echo "3. Bắt đầu quá trình cài đặt (Sẽ mất khoảng 1-2 phút)..."
# Sử dụng gói kube-prometheus-stack (Gói chuẩn mực công nghiệp bao gồm cả Grafana và Prometheus)
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set grafana.adminPassword=prom-operator \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set coreDns.enabled=true \
  --set kubeControllerManager.enabled=false \
  --set kubeEtcd.enabled=false \
  --set kubeScheduler.enabled=false

echo "=========================================================="
echo "✅ Cài đặt THÀNH CÔNG!"
echo "Để mở giao diện đồ họa Grafana, hãy chạy lệnh sau:"
echo "kubectl port-forward svc/prometheus-grafana 8080:80 -n monitoring"
echo "Sau đó truy cập http://localhost:8080 với tài khoản:"
echo "User: admin"
echo "Pass: prom-operator"
echo "=========================================================="
