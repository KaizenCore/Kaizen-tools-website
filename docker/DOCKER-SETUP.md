# Docker Setup Guide

Complete guide for setting up and deploying the Laravel application with Docker.

## Quick Start

### Option 1: Standalone Container (SQLite)

```bash
# Build the image
docker build -t laravel-app .

# Run with SQLite (default)
docker run -d \
  --name laravel \
  -p 80:80 \
  -v $(pwd)/database:/app/database \
  -v $(pwd)/storage:/app/storage \
  -e APP_KEY=base64:your-app-key-here \
  laravel-app

# Access the application
open http://localhost
```

### Option 2: Docker Compose (MySQL + Redis)

```bash
# Copy the example compose file
cp docker-compose.example.yml docker-compose.yml

# Set up environment
cp .env.example .env
# Edit .env with your settings

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access services:
# - Application: http://localhost
# - MailHog: http://localhost:8025
# - phpMyAdmin: http://localhost:8080 (with --profile tools)
```

## Configuration Files

### Environment Variables (.env)

Key variables to configure:

```env
# Application
APP_NAME=Laravel
APP_ENV=production
APP_KEY=base64:... # Generate with: docker run laravel-app php artisan key:generate --show
APP_DEBUG=false
APP_URL=http://localhost

# Database (for MySQL)
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

# Cache & Queue (for Redis)
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=redis
REDIS_PORT=6379

# For SQLite (default)
DB_CONNECTION=sqlite
DB_DATABASE=/app/database/database.sqlite
```

## Build Optimizations

### Multi-Stage Build Process

The Dockerfile uses three stages:

1. **Composer Stage**: Installs PHP dependencies in isolation
2. **Node Stage**: Builds frontend assets in parallel
3. **Runtime Stage**: Combines artifacts into minimal production image

### Build Arguments

```bash
# Use specific PHP version
docker build --build-arg PHP_VERSION=8.5 -t laravel-app .

# Build with cache from registry
docker build --cache-from registry.example.com/laravel-app:latest -t laravel-app .
```

### Layer Caching Strategy

Files are copied in optimal order:
1. Dependency files first (composer.json, package.json)
2. Install dependencies (cached if files unchanged)
3. Copy application code last (changes most frequently)

## Performance Tuning

### 1. PHP-FPM Workers

Edit `/Users/timiliris/Documents/GitHub/blueprint/web-app/docker/php-fpm.conf`:

```ini
# For low-traffic sites (default)
pm.max_children = 20
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6

# For high-traffic sites
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 15
```

Formula for `pm.max_children`:
```
max_children = Available RAM / Average Memory per Process
Example: 2GB RAM / 50MB = 40 workers
```

### 2. Queue Workers

Edit `/Users/timiliris/Documents/GitHub/blueprint/web-app/docker/supervisord.conf`:

```ini
[program:queue-worker]
# Increase from 2 to desired number
numprocs=4
```

### 3. OPcache

OPcache is pre-configured in `/Users/timiliris/Documents/GitHub/blueprint/web-app/docker/php.ini`:

```ini
opcache.enable = 1
opcache.memory_consumption = 128      # Increase for large apps
opcache.max_accelerated_files = 10000
opcache.validate_timestamps = 0       # Disable for production
```

For preloading (Laravel 11+):
```php
// config/opcache.php or custom preload script
<?php
require __DIR__ . '/../vendor/autoload.php';
```

Set environment variable:
```bash
docker run -e OPCACHE_PRELOAD=/app/config/opcache.php laravel-app
```

### 4. Nginx Tuning

Edit `/Users/timiliris/Documents/GitHub/blueprint/web-app/docker/nginx.conf` for high traffic:

```nginx
# Increase buffer sizes
fastcgi_buffer_size 256k;
fastcgi_buffers 512 16k;
fastcgi_busy_buffers_size 512k;

# Increase worker connections (requires editing nginx.conf main context)
worker_connections 2048;
```

### 5. MySQL Optimization

For production, adjust `/Users/timiliris/Documents/GitHub/blueprint/web-app/docker/mysql/my.cnf`:

```ini
# For servers with 4GB+ RAM
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 500
```

## Deployment Strategies

### Development Environment

```yaml
# docker-compose.override.yml
version: '3.8'
services:
  app:
    environment:
      APP_ENV: local
      APP_DEBUG: true
      SKIP_MIGRATIONS: ""  # Run migrations
      RUN_SEEDERS: "1"     # Run seeders
    volumes:
      - .:/app  # Mount source for live reload
```

### Production Deployment

```bash
# 1. Build production image
docker build -t registry.example.com/laravel-app:1.0.0 .

# 2. Push to registry
docker push registry.example.com/laravel-app:1.0.0

# 3. Deploy with compose
cat > docker-compose.prod.yml <<EOF
version: '3.8'
services:
  app:
    image: registry.example.com/laravel-app:1.0.0
    environment:
      APP_ENV: production
      APP_DEBUG: false
      SKIP_MIGRATIONS: "1"  # Run migrations manually
    restart: always
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
EOF

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: laravel-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: laravel
  template:
    metadata:
      labels:
        app: laravel
    spec:
      containers:
      - name: app
        image: registry.example.com/laravel-app:1.0.0
        ports:
        - containerPort: 80
        env:
        - name: APP_KEY
          valueFrom:
            secretKeyRef:
              name: laravel-secrets
              key: app-key
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: laravel-secrets
              key: db-password
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Monitoring & Logging

### Health Checks

```bash
# Application health
curl http://localhost/health

# PHP-FPM status
docker exec laravel wget -qO- http://localhost/fpm-status

# PHP-FPM ping
docker exec laravel wget -qO- http://localhost/fpm-ping
```

### Logs

```bash
# Application logs
docker logs -f laravel

# Specific service logs
docker exec laravel supervisorctl tail -f php-fpm
docker exec laravel supervisorctl tail -f nginx
docker exec laravel supervisorctl tail -f queue-worker

# Laravel logs
docker exec laravel tail -f storage/logs/laravel.log

# Nginx access logs
docker exec laravel tail -f /var/log/nginx/access.log
```

### Metrics Collection

For production monitoring, consider:

1. **Prometheus + Grafana**
   - Export PHP-FPM metrics
   - Monitor container resources
   - Track application performance

2. **ELK Stack** (Elasticsearch, Logstash, Kibana)
   - Centralized log aggregation
   - Log analysis and searching
   - Custom dashboards

3. **Application Performance Monitoring**
   - New Relic
   - Datadog
   - Sentry for error tracking

## Backup & Recovery

### Database Backups

```bash
# MySQL backup
docker exec laravel-mysql mysqldump \
  -u laravel -psecret laravel > backup.sql

# Restore
docker exec -i laravel-mysql mysql \
  -u laravel -psecret laravel < backup.sql

# SQLite backup
docker cp laravel:/app/database/database.sqlite backup.sqlite
```

### Volume Backups

```bash
# Backup storage volume
docker run --rm \
  -v laravel_storage:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/storage-backup.tar.gz -C /data .

# Restore
docker run --rm \
  -v laravel_storage:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/storage-backup.tar.gz -C /data
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs laravel

# Run interactively
docker run -it --entrypoint /bin/sh laravel-app

# Check supervisord status
docker exec laravel supervisorctl status
```

### Permission Issues

```bash
# Fix permissions on host
sudo chown -R 33:33 storage database
sudo chmod -R 775 storage database

# Or run as current user (development only)
docker run --user $(id -u):$(id -g) ...
```

### Database Connection Failed

```bash
# Check database is running
docker-compose ps

# Test connection
docker exec laravel php artisan db:monitor

# Skip migrations if DB not ready
docker run -e SKIP_MIGRATIONS=1 laravel-app
```

### Out of Memory

```bash
# Check container resources
docker stats laravel

# Increase PHP memory limit
docker run -e PHP_MEMORY_LIMIT=512M laravel-app

# Reduce PHP-FPM workers in php-fpm.conf
```

### Slow Performance

```bash
# Check OPcache status
docker exec laravel php -r "print_r(opcache_get_status());"

# Clear all caches
docker exec laravel php artisan optimize:clear

# Rebuild caches
docker exec laravel php artisan optimize
```

## Security Best Practices

1. **Never commit secrets**: Use environment variables or Docker secrets
2. **Run as non-root**: Container uses `www-data` for application
3. **Keep images updated**: Regularly rebuild with latest base images
4. **Scan for vulnerabilities**: Use `docker scan` or Trivy
5. **Use TLS**: Deploy behind reverse proxy with HTTPS
6. **Limit resources**: Set memory and CPU limits in production
7. **Network isolation**: Use Docker networks, not host networking
8. **Read-only filesystem**: Where possible, mount volumes read-only

## CI/CD Integration

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

test:
  stage: test
  script:
    - docker run $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA php artisan test

deploy:
  stage: deploy
  script:
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
```

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build image
        run: docker build -t laravel-app .

      - name: Run tests
        run: docker run laravel-app php artisan test

      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USERNAME }} --password-stdin
          docker tag laravel-app registry.example.com/laravel-app:latest
          docker push registry.example.com/laravel-app:latest
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Nginx Tuning](https://www.nginx.com/blog/tuning-nginx/)
- [PHP-FPM Configuration](https://www.php.net/manual/en/install.fpm.configuration.php)
- [MySQL Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
