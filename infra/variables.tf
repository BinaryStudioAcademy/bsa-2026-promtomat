variable "region" {
  type        = string
  default     = "eu-central-1"
  description = "AWS Region"
}

variable "availability_zone" {
  type        = string
  default     = "eu-central-1a"
  description = "Subnet AZ"
}

variable "availability_zone2" {
  type        = string
  default     = "eu-central-1b"
  description = "Subnet 2 AZ"
}

variable "rds_subnets" {
  type = map(object({ cidr = string, az = string }))
  default = {
    a = { cidr = "10.0.3.0/24", az = "eu-central-1a" }
    b = { cidr = "10.0.4.0/24", az = "eu-central-1b" }
  }
}

variable "db_username" {
  type        = string
  default     = "postgres"
  description = "RDS DB Username"
}

variable "ecr_frontend" {
  type        = string
  default     = "promptomat/frontend"
  description = "Promptomat Frontend image"
}

variable "ecr_backend" {
  type        = string
  default     = "promptomat/backend"
  description = "Promptomat Backend image"
}

variable "db_dialect" {
  type        = string
  default     = "pg"
  description = "DB Dialect"
}

variable "db_pool_min" {
  type        = number
  default     = 2
  description = "DB Pool Min"
}

variable "db_pool_max" {
  type        = number
  default     = 10
  description = "DB Pool Max"
}

variable "node_env" {
  type        = string
  default     = "development"
  description = "Node ENV"
}

variable "backend_port" {
  type        = number
  default     = 3001
  description = "Backend Port"
}

variable "backend_host" {
  type        = string
  default     = "0.0.0.0"
  description = "Backend Host"
}

variable "image_tag" {
  type    = string
  default = "seed"
}

variable "jwt_expires_in" {
  type    = string
  default = "24h"
}

variable "jwt_alg" {
  type    = string
  default = "HS256"
}

variable "salt_length" {
  type    = number
  default = 16
}

variable "embedding_model_id" {
  type    = string
  default = "Xenova/bge-m3"
}

variable "embedding_s3_bucket" {
  type    = string
  default = "promptomat-local-models"
}

variable "embedding_s3_prefix" {
  type    = string
  default = "bge-m3/"
}

variable "embedding_local_path" {
  type    = string
  default = "./.model-cache"
}

variable "embedding_dimensions" {
  type    = number
  default = 1024
}
