terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "diabetetrack-terraform-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name = "diabetetrack-vpc"
  }
}

# Subnets publics
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags = {
    Name = "diabetetrack-public-${count.index + 1}"
  }
}

# Subnets privés
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags = {
    Name = "diabetetrack-private-${count.index + 1}"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "main" {
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t3.micro"
  db_name                = "diabetetrack"
  username               = var.db_username
  password               = var.db_password
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  tags = {
    Name = "diabetetrack-db"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "diabetetrack-cluster"
  tags = {
    Name = "diabetetrack-cluster"
  }
}

# ECR Repository
resource "aws_ecr_repository" "main" {
  name = "diabetetrack-backend"
  image_scanning_configuration {
    scan_on_push = true
  }
  tags = {
    Name = "diabetetrack-backend"
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/diabetetrack"
  retention_in_days = 30
}

data "aws_availability_zones" "available" {}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}