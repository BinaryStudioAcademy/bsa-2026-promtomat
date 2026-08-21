output "alb_dns_name" {
  value = aws_alb.lb.dns_name
}

output "ecr_repository_urls" {
  value = { for k, r in aws_ecr_repository.ecr : k => r.repository_url }
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.fargate.name
}

output "ecs_service_names" {
  value = {
    backend  = aws_ecs_service.fargate_backend.name
    frontend = aws_ecs_service.fargate_frontend.name
  }
}
