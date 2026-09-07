data "aws_iam_policy_document" "ecs_tasks_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_execution_frontend" {
  name               = "promptomat-ecs-execution-frontend"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role" "ecs_execution_backend" {
  name               = "promptomat-ecs-execution-backend"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy_attachment" "execution_base" {
  for_each = {
    frontend = aws_iam_role.ecs_execution_frontend.name
    backend  = aws_iam_role.ecs_execution_backend.name
  }
  role       = each.value
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "backend_secret" {
  name = "read-db-secret"
  role = aws_iam_role.ecs_execution_backend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["secretsmanager:GetSecretValue"]
      Resource = [local.db_secret_arn, aws_secretsmanager_secret.jwt.arn]
    }]
  })
}

resource "aws_iam_role" "lambda_ecs" {
  name = "ecs-redeploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "ecs_redeploy" {
  name = "ecs-redeploy-policy"
  role = aws_iam_role.lambda_ecs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["ecs:UpdateService"]
        Effect   = "Allow"
        Resource = aws_ecs_service.fargate_backend.arn
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role" "backend_s3" {
  name = "promptomat-backend-s3"

  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy" "backend_s3_access" {
  name = "read-write-model-bucket"
  role = aws_iam_role.backend_s3.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:PutObject"]
        Resource = [
          aws_s3_bucket.local_model.arn,
          "${aws_s3_bucket.local_model.arn}/*"
        ]
        }, {
        Effect = "Allow"
        Action = ["s3:ListBucket"]
        Resource = [
          aws_s3_bucket.local_model.arn
        ]
      }
    ]
  })
}
