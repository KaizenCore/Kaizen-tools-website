# Build stage for Composer dependencies
FROM composer:latest AS composer-build

WORKDIR /app

# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --prefer-dist \
    --no-interaction

# Copy app files needed for autoload generation
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY routes ./routes

# Generate optimized autoloader
RUN composer dump-autoload --optimize --no-dev

# Build stage for Node dependencies and assets
FROM node:20-alpine AS node-build

WORKDIR /app

# Install PHP for Wayfinder type generation
RUN apk add --no-cache php83 php83-phar php83-mbstring php83-openssl php83-tokenizer php83-ctype php83-session php83-json \
    && ln -sf /usr/bin/php83 /usr/bin/php

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --no-audit --prefer-offline

# Copy application files needed for build
COPY . .

# Copy vendor from composer stage (needed for Wayfinder)
COPY --from=composer-build /app/vendor ./vendor

# Build frontend assets
RUN npm run build

# Final runtime stage
FROM php:8.4-fpm-alpine

# Install runtime dependencies and build dependencies in one layer
RUN apk add --no-cache \
    # Runtime dependencies
    nginx \
    supervisor \
    sqlite \
    sqlite-libs \
    libpng \
    libxml2 \
    oniguruma \
    # Build dependencies (will be removed)
    $PHPIZE_DEPS \
    sqlite-dev \
    libpng-dev \
    libxml2-dev \
    oniguruma-dev \
    && docker-php-ext-install -j$(nproc) \
        pdo_sqlite \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        opcache \
    # Remove build dependencies
    && apk del $PHPIZE_DEPS \
        sqlite-dev \
        libpng-dev \
        libxml2-dev \
        oniguruma-dev \
    # Clean up
    && rm -rf /var/cache/apk/* /tmp/*

# Copy PHP-FPM configuration
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/99-custom.ini

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisord.conf

# Set working directory
WORKDIR /app

# Copy vendor from composer build stage
COPY --from=composer-build /app/vendor ./vendor

# Copy built assets from node build stage
COPY --from=node-build /app/public/build ./public/build

# Copy application files
COPY --chown=www-data:www-data . .

# Final composer autoload optimization
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev \
    && rm /usr/bin/composer

# Create storage directories and set permissions
RUN mkdir -p \
    storage/framework/{sessions,views,cache} \
    storage/logs \
    bootstrap/cache \
    database \
    && touch database/database.sqlite \
    && chmod -R 775 storage bootstrap/cache database \
    && chown -R www-data:www-data storage bootstrap/cache database

# Copy and prepare entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create supervisor log directory
RUN mkdir -p /var/log/supervisor

# Define volumes for persistent data
VOLUME ["/app/database", "/app/storage"]

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start services
ENTRYPOINT ["/entrypoint.sh"]
