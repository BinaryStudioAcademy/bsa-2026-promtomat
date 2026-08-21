resource "aws_db_subnet_group" "pg" {
  subnet_ids = [ for subnet in aws_subnet.rds : subnet.id ]
}

resource "aws_db_instance" "pg" {
  db_name = "prod"
  engine = "postgres"
  engine_version = "18.4"
  instance_class = "db.t3.micro"
  manage_master_user_password = true
  storage_encrypted = true
  username = var.db_username
  db_subnet_group_name = aws_db_subnet_group.pg.name
  allocated_storage = 10
  skip_final_snapshot = true
  vpc_security_group_ids = [ aws_security_group.rds.id ]
  backup_retention_period = 7
}
