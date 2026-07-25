# Unified Mentors

Unified Mentors is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). 

## 🚀 Tech Stack

### Frontend
- **React.js** (v19)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **React Router DOM** (Routing)
- **Lucide React** (Icons)
- **Axios** (HTTP client)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **JSON Web Tokens (JWT)** (Authentication)
- **Bcrypt.js** (Password Hashing)
- **Cors & Dotenv**

## 📂 Project Structure

```text
unified-mentors/
├── frontend/       # React application
└── backend/        # Node.js/Express server
```

## 🛠️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### 1. Backend Setup
Open a terminal, navigate to the backend directory, and install dependencies:
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory and add necessary variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).
- Start the development server:
```bash
npm run dev
```
The backend server will run on `http://localhost:5000` (or whatever port you configure).

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
- Start the frontend development server:
```bash
npm run dev
```
The frontend will be accessible at the local URL provided by Vite (usually `http://localhost:5173`).

## 📜 Scripts

### Project Root (`/`)
- `npm run dev`: Runs both the frontend and backend development servers concurrently.
- `npm run backend`: Runs only the backend development server.
- `npm run frontend`: Runs only the frontend development server.

### Backend (`/backend`)
- `npm start`: Starts the production server.
- `npm run dev`: Starts the server with Nodemon for development with auto-reloading.

### Frontend (`/frontend`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs oxlint for code linting.
