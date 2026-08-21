locals {
  db_secret_arn = aws_db_instance.pg.master_user_secret[0].secret_arn
}
