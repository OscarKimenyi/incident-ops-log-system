FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && apt-get clean

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY backend/ .

RUN composer install --optimize-autoloader --no-dev

EXPOSE 8000

CMD php artisan config:clear && php artisan migrate --force && php -S 0.0.0.0:$PORT -t public