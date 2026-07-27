# RoomEase - Co-Living & Accommodation Platform

RoomEase is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This project was built to solve the problem of finding compatible roommates and managing shared rental properties.

## 🚀 Tech Stack

### Frontend
- **React.js** (v19)
- **Vite**
- **Tailwind CSS**
- **React Router DOM**
- **Lucide React** (Icons)
- **Axios**

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **Socket.io** (For real-time chat)
- **JSON Web Tokens (JWT)** (Authentication)
- **Bcrypt.js** (Password Hashing)

## 📂 Project Structure

```text
RoomEase/
├── frontend/       # React application (Tenant & Owner portals)
└── backend/        # Node.js/Express server API
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
