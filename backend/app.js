import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Import necessary for ES modules
import { Router } from "express";
import transactionRoutes from "./routes/transactions-routes.js";
import keyRoutes from "./routes/key-routes.js";
import keyholderRoutes from "./routes/keyholder-routes.js";
import cors from 'cors';
import { config } from 'dotenv';
import userRoutes from "./routes/user-routes.js";
import sequelize from './db/connection.js'; // Import Sequelize instance

// Load environment variables from .env file
config();

const app = express();

// Enable CORS for cross-origin requests
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Define API routes
app.use("/api/transactions", transactionRoutes); // Handle transactions-related requests
app.use("/api/keys", keyRoutes); // Handle keys-related requests
app.use("/api/keyholders", keyholderRoutes); // Handle keyholders-related requests
app.use("/api/users", userRoutes);

// Serve static files from the React app
const __filename = fileURLToPath(import.meta.url); // Resolve __dirname for ES modules
const __dirname = path.dirname(__filename);

// Middleware to serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch all requests and send the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

export default app;
