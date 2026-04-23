#!/usr/bin/env bash

set -euo pipefail

echo "Running deployment script"
echo "Starting Laravel application setup..."

# Runtime flags (override with env vars)
RUN_COMPOSER_INSTALL="${RUN_COMPOSER_INSTALL:-1}"
RUN_NPM_INSTALL="${RUN_NPM_INSTALL:-1}"
RUN_NPM_BUILD="${RUN_NPM_BUILD:-1}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-1}"
RUN_SEEDERS="${RUN_SEEDERS:-0}"
START_SERVER="${START_SERVER:-1}"
APP_PORT="${PORT:-8000}"

echo "🚀 Deploying Laravel app..."

if [ "${RUN_COMPOSER_INSTALL}" = "1" ]; then
	echo "📦 Installing PHP dependencies..."
	composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
fi

if [ "${RUN_NPM_INSTALL}" = "1" ]; then
	echo "📦 Installing Node dependencies..."
	npm ci --no-audit --no-fund
fi

if [ "${RUN_NPM_BUILD}" = "1" ]; then
	echo "🏗️ Building frontend assets..."
	npm run build
fi

echo "🧹 Clearing old Laravel caches..."
php artisan optimize:clear

if [ -f .env ] && ! grep -qE '^APP_KEY=.+' .env; then
	echo "🔑 APP_KEY missing, generating..."
	php artisan key:generate --no-interaction
fi

if [ "${RUN_MIGRATIONS}" = "1" ]; then
	echo "🗃️ Running migrations..."
	php artisan migrate --force --no-interaction
fi

if [ "${RUN_SEEDERS}" = "1" ]; then
	echo "🌱 Running seeders..."
	php artisan db:seed --force --no-interaction
fi

echo "⚡ Caching Laravel configuration/routes/views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ "${START_SERVER}" = "1" ]; then
	echo "🌐 Starting web server on 0.0.0.0:${APP_PORT}..."
	php artisan serve --host=0.0.0.0 --port="${APP_PORT}"
else
	echo "✅ Build and deploy steps completed. START_SERVER=0 so server was not started."
fi