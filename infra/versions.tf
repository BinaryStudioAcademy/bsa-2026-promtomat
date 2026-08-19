terraform {
  # Specifies the allowed Terraform CLI engine versions
  required_version = ">= 1.11.0, < 2.0.0"

  # Specifies the external plugins/providers required by this configuration
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.7"
    }
  }
}
