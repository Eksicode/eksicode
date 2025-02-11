# Eksicode Web Project

# Development 
Create ".env" file into the backend of the project from "sample.env" file.
Create ".env" file into the frontend folder from "sample.env" file.

docker run -d --name eksicode-postgres -e POSTGRESDB=eksicode -e POSTGRES_USER=eksicode -e POSTGRES_PASSWORD=eksicode -p 5432:5432 postgres:latest

npx prisma generate
npx prisma migrate dev
npx prisma db seed

# in the root folder run
npm install
npm run setup

# For Macos and Linux run
npm run dev 

# For Windows run
npm run dev-win 

# to kill the process and release ports use
<!-- Frontend -->
npx kill-port 3000
<!-- Backend -->
npx kill-port 9000

# Production Deployment
To start Docker in production mode run
docker-compose -f docker-compose.yml up --build