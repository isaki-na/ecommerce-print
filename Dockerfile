FROM node:22-bookworm-slim AS assets
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM php:8.3-cli-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libicu-dev libzip-dev \
    && docker-php-ext-install intl zip pdo pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .
COPY --from=assets /app/public/build ./public/build

RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-scripts \
    && mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/framework/testing storage/logs bootstrap/cache \
    && chmod -R a+rw storage bootstrap/cache \
    && chmod +x deployment/start.sh

ENV APP_ENV=production
ENV RUN_COMPOSER_INSTALL=0
ENV RUN_NPM_INSTALL=0
ENV RUN_NPM_BUILD=0
ENV RUN_MIGRATIONS=1
ENV RUN_SEEDERS=0
ENV START_SERVER=1
EXPOSE 8080

CMD ["bash", "deployment/start.sh"]
