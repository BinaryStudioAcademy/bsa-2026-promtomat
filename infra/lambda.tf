data "archive_file" "lambda_zip" {
  type        = "zip"
  output_path = "${path.module}/lambda.zip"

  source {
    filename = "index.py"
    content  = <<EOF
import boto3
import os

ecs_client = boto3.client('ecs')

def handler(event, context):
    cluster = os.environ['ECS_CLUSTER']
    service = os.environ['ECS_SERVICE']

    print(f"Triggering rolling redeployment for service {service} in cluster {cluster}...")

    response = ecs_client.update_service(
        cluster=cluster,
        service=service,
        forceNewDeployment=True
    )

    print("Redeployment initiated successfully.")
EOF
  }
}

resource "aws_lambda_function" "ecs_redeploy" {
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  function_name = "ecs-redeploy-on-secret-rotation"
  role = aws_iam_role.lambda_ecs.arn
  handler = "index.handler"
  runtime = "python3.11"
  timeout = 10

  environment {
    variables = {
      ECS_CLUSTER = "Fargate"
      ECS_SERVICE = "promptomat-backend"
    }
  }
}

data "aws_secretsmanager_secret" "db" {
  arn = local.db_secret_arn
}

resource "aws_cloudwatch_event_rule" "secret_rotation_rule" {
  name = "secret_rotation"
  description = "Triggers ECS redeploy on secret rotation"

  event_pattern = jsonencode({
    source      = ["aws.secretsmanager"],
    "detail-type" = ["Secret Label Updated"],
    detail = {
      name         = [data.aws_secretsmanager_secret.db.name]
      labelUpdated = ["AWSCURRENT"]
    }
  })
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule = aws_cloudwatch_event_rule.secret_rotation_rule.name
  target_id = "TriggerECSRedeploy"
  arn = aws_lambda_function.ecs_redeploy.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id = "AllowExecutionFromEventBridge"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_redeploy.function_name
  principal = "events.amazonaws.com"
  source_arn = aws_cloudwatch_event_rule.secret_rotation_rule.arn
}
