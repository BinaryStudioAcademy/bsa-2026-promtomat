data "aws_ami" "al2023_arm" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "aws_iam_policy_document" "ec2_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "bastion" {
  name               = "promptomat-bastion"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume.json
}

resource "aws_iam_role_policy_attachment" "bastion_ssm" {
  role       = aws_iam_role.bastion.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "bastion" {
  name = "promptomat-bastion"
  role = aws_iam_role.bastion.name
}

resource "aws_security_group" "bastion" {
  vpc_id      = aws_vpc.vpc.id
  name        = "bastion"
  description = "Bastion host for SSM port forwarding to RDS"
}

resource "aws_vpc_security_group_egress_rule" "bastion" {
  security_group_id = aws_security_group.bastion.id
  description       = "Allow all egress"
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_vpc_security_group_ingress_rule" "rds_from_bastion" {
  security_group_id            = aws_security_group.rds.id
  description                  = "Postgres from bastion"
  referenced_security_group_id = aws_security_group.bastion.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
}

resource "aws_instance" "bastion" {
  ami                    = data.aws_ami.al2023_arm.id
  instance_type          = "t4g.nano"
  subnet_id              = aws_subnet.private_subnet.id
  vpc_security_group_ids = [aws_security_group.bastion.id]
  iam_instance_profile   = aws_iam_instance_profile.bastion.name

  associate_public_ip_address = false

  metadata_options {
    http_tokens   = "required"
    http_endpoint = "enabled"
  }

  root_block_device {
    volume_size = 8
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name = "promptomat-bastion"
  }
}

resource "aws_iam_policy" "qa_db_access" {
  name        = "promptomat-qa-db-access"
  description = "Allows QA to open an SSM port-forwarding session to the bastion"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "StartPortForwardingSession"
        Effect = "Allow"
        Action = ["ssm:StartSession"]
        Resource = [
          aws_instance.bastion.arn,
          "arn:aws:ssm:${var.region}::document/AWS-StartPortForwardingSessionToRemoteHost",
        ]
      },
      {
        Sid      = "ManageOwnSessions"
        Effect   = "Allow"
        Action   = ["ssm:TerminateSession", "ssm:ResumeSession"]
        Resource = ["arn:aws:ssm:*:*:session/$${aws:username}-*"]
      },
    ]
  })
}

output "bastion_instance_id" {
  description = "Pass to --target in aws ssm start-session"
  value       = aws_instance.bastion.id
}

output "rds_endpoint_address" {
  description = "Pass as the host parameter in the port forwarding call"
  value       = aws_db_instance.pg.address
}
