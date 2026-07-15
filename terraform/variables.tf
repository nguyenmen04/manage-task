variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1" # Singapore - Độ trễ thấp nhất về Việt Nam
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "manage-task-cluster"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}
