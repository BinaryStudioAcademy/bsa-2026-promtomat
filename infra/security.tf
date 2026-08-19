resource "aws_security_group" "web" {
  vpc_id = aws_vpc.vpc.id
  name = "web_traffic_sg"
  description = "Web traffic SG"
}

resource "aws_vpc_security_group_ingress_rule" "web_http" {
  security_group_id = aws_security_group.web.id
  description = "Allow HTTP Traffic"
  from_port = 80
  to_port = 80
  ip_protocol = "tcp"
  cidr_ipv4 = "0.0.0.0/0"
}

resource "aws_vpc_security_group_ingress_rule" "web_https" {
  security_group_id = aws_security_group.web.id
  description = "Allow HTTPS Traffic"
  from_port = 443
  to_port = 443
  ip_protocol = "tcp"
  cidr_ipv4 = "0.0.0.0/0"
}

resource "aws_vpc_security_group_egress_rule" "web" {
  security_group_id = aws_security_group.web.id
  description = "Allow Egress Traffic"
  ip_protocol = "-1"
  cidr_ipv4 = "0.0.0.0/0"
}

resource "aws_security_group" "ecs_backend" {
  vpc_id = aws_vpc.vpc.id
  name = "ecs_backend"
  description = "ECS Backend SG"
}

resource "aws_vpc_security_group_egress_rule" "ecs_backend" {
  security_group_id = aws_security_group.ecs_backend.id
  description = "Allow Egress Traffic"
  ip_protocol = "-1"
  cidr_ipv4 = "0.0.0.0/0"
}

resource "aws_security_group" "rds" {
  vpc_id = aws_vpc.vpc.id
  name = "rds_sg"
  description = "Traffic to RDS SG (Only from Backend)"
}

resource "aws_vpc_security_group_ingress_rule" "rds" {
  security_group_id = aws_security_group.rds.id
  referenced_security_group_id = aws_security_group.ecs_backend.id
  description = "Allow RDS Traffic"
  from_port = 5432
  to_port = 5432
  ip_protocol = "tcp"
}

resource "aws_security_group" "ecs_frontend" {
  vpc_id = aws_vpc.vpc.id
  name = "ecs_frontend"
  description = "ECS Frontend SG"
}

resource "aws_vpc_security_group_egress_rule" "ecs_frontend" {
  security_group_id = aws_security_group.ecs_frontend.id
  description = "Allow Egress Traffic"
  ip_protocol = "-1"
  cidr_ipv4 = "0.0.0.0/0"
}

resource "aws_vpc_security_group_ingress_rule" "frontend_from_alb" {
  security_group_id = aws_security_group.ecs_frontend.id
  referenced_security_group_id = aws_security_group.web.id
  from_port = 80
  to_port = 80
  ip_protocol = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "backend_from_alb" {
  security_group_id = aws_security_group.ecs_backend.id
  referenced_security_group_id = aws_security_group.web.id
  from_port = 3001
  to_port = 3001
  ip_protocol = "tcp"
}
