data "aws_availability_zones" "available" {}

locals {
  name   = var.cluster_name
  vpc_cidr = var.vpc_cidr
  azs      = slice(data.aws_availability_zones.available.names, 0, 2)
}

################################################################################
# VPC Module (Chuẩn Doanh Nghiệp có Private Subnet & NAT Gateway)
################################################################################
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${local.name}-vpc"
  cidr = local.vpc_cidr

  azs             = local.azs
  # Private subnets cho Worker Nodes (Bảo mật tối đa, không có IP Public)
  private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k)]
  # Public subnets cho NAT Gateway và Load Balancers
  public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k + 4)]

  # Bật NAT Gateway để các Node trong Private Subnet có thể tải Docker Image từ Internet
  enable_nat_gateway   = true
  single_nat_gateway   = true # Dùng 1 NAT Gateway để tối ưu chi phí cho đồ án
  enable_dns_hostnames = true

  public_subnet_tags = {
    "kubernetes.io/role/elb"                      = 1
    "kubernetes.io/cluster/${var.cluster_name}"   = "shared"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb"             = 1
    "kubernetes.io/cluster/${var.cluster_name}"   = "shared"
  }
}

################################################################################
# EKS Cluster Module
################################################################################
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.30"

  # Cấp quyền truy cập vào Cluster qua API (Dành cho kubectl)
  cluster_endpoint_public_access = true

  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.private_subnets

  # Cấu hình Managed Node Group (Worker Nodes)
  eks_managed_node_groups = {
    # Tên của nhóm công nhân
    manage_task_nodes = {
      # Đặt Worker Nodes vào Private Subnet
      subnet_ids = module.vpc.private_subnets

      # Cấu hình loại máy (EC2)
      instance_types = ["t3.medium"] # Đủ RAM để chạy DB + Backend + Frontend

      # Auto Scaling (Tự động co giãn số lượng công nhân)
      min_size     = 2 # Tối thiểu lúc nào cũng có 2 máy
      max_size     = 3 # Khi tải cao, tối đa đẻ thêm thành 3 máy
      desired_size = 2 # Mặc định duy trì 2 máy
    }
  }

  # Cho phép user đang chạy Terraform được quyền làm admin của Cluster
  enable_cluster_creator_admin_permissions = true
}
