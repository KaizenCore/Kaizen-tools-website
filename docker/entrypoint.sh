#!/bin/sh
set -e

# Create SQLite database if it doesn't exist
if [ ! -f /app/database/database.sqlite ]; then
    echo "Creating SQLite database..."
    touch /app/database/database.sqlite
    chown www-data:www-data /app/database/database.sqlite
fi

# Ensure proper permissions
chown -R www-data:www-data /app/storage /app/bootstrap/cache /app/database

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "Warning: APP_KEY is not set. Generating one..."
    php artisan key:generate --force
fi

# Cache configuration for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Run seeders
echo "Running seeders..."
php artisan db:seed --force

# Create supervisor log directory
mkdir -p /var/log/supervisor

# Start supervisor (which manages php-fpm and nginx)
exec /usr/bin/supervisord -c /etc/supervisord.conf
