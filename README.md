# Recipe Book - African Cuisine Collection

A modern recipe sharing platform built with Next.js, featuring authentic African and Cameroonian dishes. This application includes user authentication, recipe management, and a beautiful UI showcasing traditional African cuisine.

## 🍽️ Features

- **16 Authentic Recipes**: 6 Pan-African dishes + 10 traditional Cameroonian specialties
- **User Authentication**: Secure login and registration system
- **Recipe Management**: Create, edit, and share recipes
- **Rating System**: Rate and review recipes
- **Responsive Design**: Beautiful UI that works on all devices
- **Database Seeding**: Pre-populated with authentic African recipes and images

## 🚀 Quick Start with Docker (Recommended)

The easiest way to run the application is using Docker Compose, which will automatically set up the database and seed it with recipes.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-book
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - The database will be automatically created and seeded with 16 authentic African recipes

4. **Stop the application**
   ```bash
   docker-compose down
   ```

### What happens during startup:
- ✅ PostgreSQL database is created (no persistent volumes - fresh start each time)
- ✅ Database schema is applied via Prisma
- ✅ Database is automatically seeded with 16 authentic African recipes
- ✅ Next.js application starts and connects to the database

## 🛠️ Local Development Setup

If you prefer to run the application locally without Docker:

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [PostgreSQL](https://www.postgresql.org/) database

### Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/recipebook?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up the database**
   ```bash
   # Apply database schema
   npx prisma db push --accept-data-loss
   
   # Seed the database with recipes
   npm run seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Database Management

### Prisma Commands
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database and reseed
npx prisma db push --accept-data-loss
npm run seed

# Generate Prisma client after schema changes
npx prisma generate
```

### Seeded Recipes
The application comes pre-loaded with 16 authentic recipes:

**Pan-African Dishes:**
- Jollof Rice (West African)
- Suya (Nigerian Kebabs)
- Bobotie (South African)
- Peri-Peri Chicken (Mozambican)
- Bunny Chow (South African)
- Doro Wat (Ethiopian)

**Cameroonian Specialties:**
- Ndolé (National dish)
- Poulet DG (Director General's Chicken)
- Eru (Vegetable soup)
- Koki (Bean pudding)
- Achu Soup (Yellow soup)
- Sangah (Corn fufu)
- Mbongo Tchobi (Black stew)
- Kwacoco (Cocoyam porridge)
- Kondre (Plantain porridge)
- Puff Puff (Donuts)

## 🏗️ Project Structure

```
recipe-book/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   └── lib/                 # Utility functions and configurations
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts             # Database seeding script
├── docker-compose.yml       # Docker services configuration
├── Dockerfile              # Application container definition
└── docker-entrypoint.sh    # Container startup script
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with recipes
```

## 🐳 Docker Commands

```bash
# Build and start services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs app
docker-compose logs db

# Rebuild only the app
docker-compose build app
```

## 🌍 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS, DaisyUI
- **Deployment**: Docker, Docker Compose

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🍴 About the Recipes

All recipes featured in this application are authentic African dishes with detailed instructions and beautiful images sourced from reputable African food blogs. The recipes celebrate the rich culinary heritage of Africa, with a special focus on Cameroonian cuisine.
