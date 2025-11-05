#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
until npx prisma db push --accept-data-loss; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

# Run database migrations and seeding
echo "Running database migrations..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
npm run seed

echo "Starting the application..."
exec npm start
