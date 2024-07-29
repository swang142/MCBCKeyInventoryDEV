import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Import necessary for ES modules
import { Router } from "express";
import transactionRoutes from "./routes/transactions-routes.js";
import keyRoutes from "./routes/key-routes.js";
import keyholderRoutes from "./routes/keyholder-routes.js";
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/keys", keyRoutes);
app.use("/api/keyholders", keyholderRoutes);

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
