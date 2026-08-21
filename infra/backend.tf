terraform {
  backend "s3" {
    bucket       = "promptomat-terraform"
    key          = "production/terraform.tfstate"
    region       = "eu-central-1"
    encrypt      = true
    use_lockfile = true
  }
}
