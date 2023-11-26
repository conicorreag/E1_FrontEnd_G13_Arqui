terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-2"  
}

resource "aws_acm_certificate" "ssl_certificate" {
  domain_name = "belukoatica.me" # Cambia esto al nombre de tu dominio
  validation_method = "DNS"
}

resource "aws_cloudfront_distribution" "CloudFrontG13" {
  origin {
    domain_name = "iaac-bucket.s3.amazonaws.com"  
    origin_id   = "iaac-bucket"     
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.ssl_certificate.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"  # Puede ser "whitelist" o "blacklist"
      locations        = ["US", "CA"]  # Lista de códigos de países permitidos o denegados
    }
  }

  enabled             = true
  default_root_object = "index.html"

  # Configuración de los comportamientos (behaviors)
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "iaac-bucket"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

 
}