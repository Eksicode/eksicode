# docker/Dockerfile
FROM php:8.2-fpm as php

# Set environment variables
ENV PHP_OPCACHE_ENABLE=1
ENV PHP_OPCACHE_ENABLE_CLI=0
ENV PHP_OPCACHE_VALIDATE_TIMESTAMPS=0
ENV PHP_OPCACHE_REVALIDATE_FREQ=0

RUN usermod -u 1000 www-data

# Install dependencies.
RUN apt-get update && apt-get install -y \
    build-essential \
    libicu-dev \
    libcurl4-gnutls-dev \
    nginx \ 
    libonig-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    locales \
    zip \
    unzip \
    jpegoptim optipng pngquant gifsicle \
    nano \
    git \
    curl \
    wget \
    zsh

# Install Postgre PDO
RUN apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo \ 
    pdo_pgsql \ 
    pgsql \ 
    mysqli \
    pdo_mysql \
    # nodejs \
    # yarn \ 
    # npm \
    bcmath \
    curl \
    opcache \
    mbstring

# Set working directory to /var/www.
WORKDIR /var/www

# Copy existing app directory
COPY . .

# Copy and run composer
# COPY --from=composer:2.3.5 /usr/bin/composer /usr/composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy configuration files.
# COPY ./php/php.ini /usr/local/etc/php/php.ini
# COPY ./php/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# RUN php artisan cache:clear
# RUN php artisan config:clear

# Copy files from current folder to container current folder (set in workdir).
COPY --chown=www-data:www-data . .

RUN chown -R www-data:www-data /var/www

# Create laravel caching folders.
RUN mkdir -p /var/www/storage/framework
RUN mkdir -p /var/www/storage/framework/cache
RUN mkdir -p /var/www/storage/framework/testing
RUN mkdir -p /var/www/storage/framework/sessions
RUN mkdir -p /var/www/storage/framework/views

# Fix files ownership.
# RUN chown -R www-data /var/www/storage
# RUN chown -R www-data /var/www/storage/framework
# RUN chown -R www-data /var/www/storage/framework/sessions

# RUN chown -R www-data:www-data /var/www/storage

# Set correct permission.
# RUN chmod -R 755 /var/www/storage
# RUN chmod -R 755 /var/www/storage/logs
# RUN chmod -R 755 /var/www/storage/framework
# RUN chmod -R 755 /var/www/storage/framework/sessions
# RUN chmod -R 755 /var/www/bootstrap

# VOLUME /var/www/storage

# Adjust user permission & group
RUN usermod --uid 1000 www-data
RUN groupmod --gid 1001 www-data

# RUN chmod -R 777 entrypoint.sh

# ENTRYPOINT ["./entrypoint.sh"]
# RUN composer install --no-progress --no-interaction

# RUN php artisan migrate
# RUN php artisan optimize
# RUN php artisan view:cache

ENTRYPOINT ["./entrypoint.sh"]
# RUN php-fpm -D
# CMD [ "nginx", "-g", "daemon off;"]
