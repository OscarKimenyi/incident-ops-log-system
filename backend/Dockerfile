FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && apt-get clean

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy only the backend folder contents
COPY backend/ .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Cache Laravel config
RUN php artisan config:cache || true
RUN php artisan route:cache || true
RUN php artisan view:cache || true

# Expose port
EXPOSE 8000

# Run migrations then start server
CMD php artisan migrate --force && php -S 0.0.0.0:$PORT -t public