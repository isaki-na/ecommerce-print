echo "Running Deployment Script"
echo "Starting the application..."
#!/bin/bash

echo "🚀 Iniciando aplicación Laravel..."

echo "⏳ Esperando base de datos..."
sleep 5

echo "🗃️ Ejecutando migraciones..."
php artisan migrate --force

echo "🌱 Ejecutando seeders..."
php artisan db:seed --force

echo "⚡ Optimizando aplicación..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🧹 Limpiando caché..."
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
echo "🌐 Iniciando servidor..."
php artisan serve --host=0.0.0.0 --port=$PORT