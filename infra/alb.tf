resource "aws_alb" "lb" {
  name = "app-lb"
  subnets = [ aws_subnet.public_subnet.id, aws_subnet.public_subnet2.id ]
  security_groups = [ aws_security_group.web.id ]
  load_balancer_type = "application"
}

resource "aws_alb_target_group" "backend" {
  name = "alb-backend-target-group"
  port = 3001
  protocol = "HTTP"
  vpc_id = aws_vpc.vpc.id
  target_type = "ip"

  health_check {
    path                = "/api/v1/health"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_alb_target_group" "frontend" {
  name = "alb-frontend-target-group"
  port = 80
  protocol = "HTTP"
  vpc_id = aws_vpc.vpc.id
  target_type = "ip"
}

resource "aws_alb_listener" "frontend" {
  load_balancer_arn = aws_alb.lb.arn
  port = 80
  protocol = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = aws_alb_target_group.frontend.arn
  }
}

resource "aws_alb_listener_rule" "backend" {
  listener_arn = aws_alb_listener.frontend.arn
  priority = 100

  action {
    type = "forward"
    target_group_arn = aws_alb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}
