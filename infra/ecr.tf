resource "aws_ecr_repository" "ecr" {
  for_each = toset([ var.ecr_frontend, var.ecr_backend ])
  name = each.key
  image_tag_mutability = "IMMUTABLE"
  force_delete = true
}

resource "aws_ecr_lifecycle_policy" "ecr" {
  for_each = aws_ecr_repository.ecr
  repository = each.value.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 20 images"
      selection    = { tagStatus = "any", countType = "imageCountMoreThan", countNumber = 20 }
      action       = { type = "expire" }
    }]
  })
}
