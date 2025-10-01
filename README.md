# Barbershop Management System

A full-stack application for managing barbershops, clients, services, and appointments.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database named `barbershop`

4. Configure the environment variables in `.env`:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASS=postgres
   DB_NAME=barbershop
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

5. Run the database migrations:
   ```bash
   npm run migrate
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User authentication (login/logout)
- Barbershop management (CRUD operations)
- User management (CRUD operations)
- Client management (CRUD operations)
- Service management (CRUD operations)
- Appointment scheduling and management
- Dashboard with statistics

## Technologies Used

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT Authentication

### Frontend
- React.js
- Material-UI
- Formik + Yup
- Recharts
- Axios

## Project Structure

### Backend
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── index.js
├── .env
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   └── App.jsx
├── .env
└── package.json
```

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register

### Barbershops
- GET /api/barbershops
- POST /api/barbershops
- PUT /api/barbershops/:id
- DELETE /api/barbershops/:id

### Users
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Clients
- GET /api/clients
- POST /api/clients
- PUT /api/clients/:id
- DELETE /api/clients/:id

### Services
- GET /api/services
- POST /api/services
- PUT /api/services/:id
- DELETE /api/services/:id

### Appointments
- GET /api/appointments
- POST /api/appointments
- PUT /api/appointments/:id
- DELETE /api/appointments/:id

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 

docker-compose logs -f backend 

## Subir na VPS

sudo apt install -y git
sudo apt update
snap install docker
mkdir -p ~/apps && cd ~/apps
git clone https://github.com/borrago/barbershop.git
cd barbershop
docker compose up -d --build
