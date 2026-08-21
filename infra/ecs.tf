resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/promptomat-backend"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/promptomat-frontend"
  retention_in_days = 14
}

resource "aws_ecs_cluster" "fargate" {
  name = "Fargate"
}

resource "aws_ecs_task_definition" "fargate_backend" {
  family = "promptomat_backend"

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "${aws_ecr_repository.ecr[var.ecr_backend].repository_url}:${var.image_tag}"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3001
        }
      ]

      environment = [
        { name = "NODE_ENV", value = var.node_env },
        { name = "PORT", value = tostring(var.backend_port) },
        { name = "HOST", value = var.backend_host },
        { name = "DB_USERNAME", value = var.db_username},
        { name = "DB_HOST", value = aws_db_instance.pg.address },
        { name = "DB_PORT", value = tostring(aws_db_instance.pg.port) },
        { name = "DB_NAME", value = aws_db_instance.pg.db_name },
        { name = "DB_DIALECT", value = var.db_dialect },
        { name = "DB_POOL_MIN", value = tostring(var.db_pool_min) },
        { name = "DB_POOL_MAX", value = tostring(var.db_pool_max) },
      ]

      secrets = [
        { name = "DB_PASSWORD", valueFrom = "${local.db_secret_arn}:password::"}
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
            "awslogs-group"         = aws_cloudwatch_log_group.backend.name
            "awslogs-region"        = var.region
            "awslogs-stream-prefix" = "backend"
        }
      }
    }
  ])
  network_mode = "awsvpc"
  requires_compatibilities = [ "FARGATE" ]
  cpu = 256
  memory = 512
  execution_role_arn = aws_iam_role.ecs_execution_backend.arn
}

resource "aws_ecs_task_definition" "fargate_frontend" {
  family = "promptomat_frontend"

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "${aws_ecr_repository.ecr[var.ecr_frontend].repository_url}:${var.image_tag}"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 80
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
            "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
            "awslogs-region"        = var.region
            "awslogs-stream-prefix" = "frontend"
        }
      }
    }
  ])
  network_mode = "awsvpc"
  requires_compatibilities = [ "FARGATE" ]
  cpu = 256
  memory = 512
  execution_role_arn = aws_iam_role.ecs_execution_frontend.arn
}

resource "aws_ecs_service" "fargate_backend" {
  name = "promptomat-backend"
  cluster = aws_ecs_cluster.fargate.id
  task_definition = aws_ecs_task_definition.fargate_backend.arn
  launch_type = "FARGATE"
  desired_count = 1
  health_check_grace_period_seconds = 60

  network_configuration {
    subnets = [ aws_subnet.private_subnet.id ]
    security_groups = [ aws_security_group.ecs_backend.id ]
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.backend.arn
    container_name = "backend"
    container_port = 3001
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  depends_on = [ aws_alb_listener.frontend ]
}

resource "aws_ecs_service" "fargate_frontend" {
  name = "promptomat-frontend"
  cluster = aws_ecs_cluster.fargate.id
  task_definition = aws_ecs_task_definition.fargate_frontend.arn
  launch_type = "FARGATE"
  desired_count = 1

  network_configuration {
    subnets = [ aws_subnet.private_subnet.id ]
    security_groups = [ aws_security_group.ecs_frontend.id ]
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 80
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  depends_on = [aws_alb_listener.frontend]
}
