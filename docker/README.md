# Docker Configuration

This directory contains the optimized Docker configuration for the Laravel application.

## Files Overview

### Dockerfile
Multi-stage Docker build with the following optimizations:
- **Stage 1 (composer-build)**: Installs PHP dependencies in isolation
- **Stage 2 (node-build)**: Builds frontend assets in isolation
- **Stage 3 (final)**: Minimal runtime image with only production dependencies

**Key Features:**
- Multi-stage builds for smaller final image size
- Layer caching optimization for faster rebuilds
- Parallel dependency installation
- OPcache enabled for PHP performance
- Health check endpoint for container orchestration
- Build dependencies removed in final stage

### nginx.conf
Production-ready Nginx configuration with:
- **Performance**: FastCGI buffering, keepalive connections, gzip compression
- **Security**: Security headers, hidden files protection, sensitive path blocking
- **Caching**: Static asset caching with 1-year expiration
- **Monitoring**: Health check endpoint at `/health`
- **Optimization**: Upstream PHP-FPM with connection pooling

### php-fpm.conf
Optimized PHP-FPM pool configuration:
- Dynamic process management (2-20 workers)
- Process recycling after 1000 requests
- Status monitoring endpoints (`/fpm-status`, `/fpm-ping`)
- Slow log tracking for performance monitoring
- Timeout protection (300s max execution)

### php.ini
Production PHP settings:
- **OPcache**: Fully enabled with optimal settings for Laravel
- **Memory**: 256M limit suitable for most Laravel apps
- **Upload**: 20M max file size
- **Security**: expose_php disabled, strict error handling
- **Performance**: Realpath cache optimization, output buffering

### supervisord.conf
Process manager configuration running:
- **php-fpm**: PHP FastCGI Process Manager
- **nginx**: Web server
- **queue-worker**: 2 Laravel queue workers with automatic restart
- **schedule**: Laravel scheduler running every minute

**Features:**
- Graceful shutdown handling
- Automatic restart on failure
- Process dependency management
- Grouped process control

### entrypoint.sh
Smart initialization script with:
- Database readiness checking
- Conditional migration execution
- Environment-aware caching (production vs development)
- Custom initialization script support
- Automatic SQLite database creation
- Permission management

## Environment Variables

### Required
- `APP_KEY`: Laravel application key (auto-generated if missing)

### Optional Configuration
- `APP_ENV`: Environment (production/development) - affects caching behavior
- `APP_DEBUG`: Debug mode (true/false)
- `DB_CONNECTION`: Database type (sqlite/mysql/pgsql)
- `DB_HOST`: Database host (for external databases)
- `SKIP_MIGRATIONS`: Set to skip migrations on startup
- `RUN_SEEDERS`: Set to run seeders (only in non-production)
- `OPCACHE_PRELOAD`: Path to OPcache preload script

## Building the Image

```bash
# Build the image
docker build -t laravel-app .

# Build with build arguments
docker build \
  --build-arg PHP_VERSION=8.5 \
  -t laravel-app:latest \
  .
```

## Running the Container

```bash
# Basic run
docker run -p 80:80 laravel-app

# With environment variables
docker run -p 80:80 \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  -e SKIP_MIGRATIONS=1 \
  laravel-app

# With volumes for persistent data
docker run -p 80:80 \
  -v $(pwd)/database:/app/database \
  -v $(pwd)/storage:/app/storage \
  laravel-app
```

## Docker Compose Example

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      APP_ENV: production
      APP_DEBUG: false
      DB_CONNECTION: mysql
      DB_HOST: mysql
      DB_DATABASE: laravel
      DB_USERNAME: laravel
      DB_PASSWORD: secret
    volumes:
      - ./storage:/app/storage
    depends_on:
      - mysql
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: laravel
      MYSQL_USER: laravel
      MYSQL_PASSWORD: secret
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## Monitoring

### Health Check
```bash
curl http://localhost/health
```

### PHP-FPM Status
```bash
docker exec <container> wget -qO- http://localhost/fpm-status
```

### PHP-FPM Ping
```bash
docker exec <container> wget -qO- http://localhost/fpm-ping
```

### View Logs
```bash
# All logs
docker logs -f <container>

# Queue worker logs only
docker exec <container> supervisorctl tail -f queue-worker

# Nginx logs
docker exec <container> supervisorctl tail -f nginx
```

## Performance Tuning

### Scaling Queue Workers
Edit `docker/supervisord.conf` and change `numprocs`:
```ini
[program:queue-worker]
numprocs=4  # Increase from 2 to 4 workers
```

### PHP-FPM Process Management
Edit `docker/php-fpm.conf` to adjust worker counts:
```ini
pm.max_children = 50      # Increase for high traffic
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 15
```

### OPcache Preloading
Create a preload script and set the environment variable:
```bash
docker run -e OPCACHE_PRELOAD=/app/preload.php laravel-app
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs <container>

# Run with interactive shell
docker run -it --entrypoint /bin/sh laravel-app
```

### Permission issues
The container runs as `www-data` user. Ensure volume permissions are correct:
```bash
chown -R 33:33 storage database
chmod -R 775 storage database
```

### Database connection issues
- Check `DB_HOST` points to the correct service
- Ensure database is ready before application starts
- Use `SKIP_MIGRATIONS=1` if database isn't ready

### Cache issues
```bash
# Clear all caches
docker exec <container> php artisan cache:clear
docker exec <container> php artisan config:clear
docker exec <container> php artisan route:clear
docker exec <container> php artisan view:clear
```

## Security Considerations

1. Never commit `.env` files with secrets
2. Use Docker secrets for sensitive data in production
3. Run container with read-only root filesystem where possible
4. Use non-root user (www-data) for application processes
5. Regularly update base images for security patches
6. Scan images with security tools (e.g., Trivy, Snyk)

## Production Deployment

For production deployments:
1. Use specific version tags, not `latest`
2. Enable HTTPS with a reverse proxy (Traefik, Nginx Proxy Manager)
3. Set up proper logging aggregation
4. Implement monitoring and alerting
5. Use orchestration (Kubernetes, Docker Swarm) for scaling
6. Configure automated backups for volumes
7. Set resource limits in orchestration configs

## Image Size Optimization

Current optimizations:
- Multi-stage builds reduce final image size
- Alpine Linux base image (minimal size)
- Build dependencies removed after compilation
- `.dockerignore` excludes unnecessary files
- Composer autoload optimization with `--classmap-authoritative`

Expected final image size: ~200-300MB (vs 1GB+ without optimization)
