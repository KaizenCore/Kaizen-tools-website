#!/bin/sh
set -e

echo "Starting Laravel application initialization..."

# Force APP_URL to use HTTPS if not already
if [ -n "$APP_URL" ]; then
    export APP_URL=$(echo "$APP_URL" | sed 's|^http://|https://|')
    echo "APP_URL set to: $APP_URL"
fi

# Function to wait for database to be ready (if using external DB)
wait_for_db() {
    if [ -n "$DB_HOST" ] && [ "$DB_CONNECTION" != "sqlite" ]; then
        echo "Waiting for database connection..."
        max_attempts=30
        attempt=0
        until php artisan db:monitor --max=1 > /dev/null 2>&1 || [ $attempt -eq $max_attempts ]; do
            attempt=$((attempt + 1))
            echo "Database not ready yet (attempt $attempt/$max_attempts)..."
            sleep 2
        done
        if [ $attempt -eq $max_attempts ]; then
            echo "Warning: Could not connect to database after $max_attempts attempts"
        else
            echo "Database connection established"
        fi
    fi
}

# Create SQLite database if it doesn't exist and we're using SQLite
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    if [ ! -f /app/database/database.sqlite ]; then
        echo "Creating SQLite database..."
        touch /app/database/database.sqlite
        chown www-data:www-data /app/database/database.sqlite
    fi
fi

# Ensure proper permissions for writable directories
echo "Setting permissions..."
chown -R www-data:www-data /app/storage /app/bootstrap/cache /app/database 2>/dev/null || true
chmod -R 775 /app/storage /app/bootstrap/cache /app/database 2>/dev/null || true

# Create supervisor log directory
mkdir -p /var/log/supervisor

# Generate app key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" ]; then
    echo "Generating application key..."
    php artisan key:generate --force --no-interaction
fi

# Wait for database if needed
wait_for_db

# Run migrations only if SKIP_MIGRATIONS is not set
if [ -z "$SKIP_MIGRATIONS" ]; then
    echo "Running database migrations..."
    php artisan migrate --force --no-interaction --isolated
else
    echo "Skipping migrations (SKIP_MIGRATIONS is set)"
fi

# Run seeders only if RUN_SEEDERS is set and we're not in production
if [ -n "$RUN_SEEDERS" ] && [ "$APP_ENV" != "production" ]; then
    echo "Running database seeders..."
    php artisan db:seed --force --no-interaction
else
    echo "Skipping seeders"
fi

# Cache configuration for production performance
if [ "$APP_ENV" = "production" ] || [ -z "$APP_DEBUG" ] || [ "$APP_DEBUG" = "false" ]; then
    echo "Caching configuration for production..."
    php artisan config:cache --no-interaction
    php artisan route:cache --no-interaction
    php artisan view:cache --no-interaction
    php artisan event:cache --no-interaction 2>/dev/null || true
else
    echo "Clearing caches for development environment..."
    php artisan config:clear --no-interaction 2>/dev/null || true
    php artisan route:clear --no-interaction 2>/dev/null || true
    php artisan view:clear --no-interaction 2>/dev/null || true
fi

# Clear and warm up opcache if enabled
if [ -n "$OPCACHE_PRELOAD" ]; then
    echo "Warming up OPcache..."
    php -d opcache.enable_cli=1 -d opcache.preload="$OPCACHE_PRELOAD" -r "echo 'OPcache warmed up';" 2>/dev/null || true
fi

# Run any custom initialization scripts
if [ -d /docker-entrypoint-init.d ]; then
    for script in /docker-entrypoint-init.d/*.sh; do
        if [ -f "$script" ]; then
            echo "Running initialization script: $script"
            sh "$script"
        fi
    done
fi

echo "Initialization complete. Starting services..."

# Start supervisor (which manages php-fpm, nginx, queue workers, and scheduler)
exec /usr/bin/supervisord -c /etc/supervisord.conf
