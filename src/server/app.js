import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import router from './routes/route.js';
import { config } from './config.js';

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Apply CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from localhost, 127.0.0.1, and the specified IP address
    // If the origin is not allowed, respond with a 403 Forbidden error
    // The allowed origins are specified in the config file
    const allowedOriginsPattern = /^http:\/\/localhost:(5173|5176|5174|3001)$/;
    // const allowedIpPattern = /^http:\/\/10\.7\.167\.119:(5173|5176|5174|3306|3002)$/;
    
    // Check if the origin is allowed
    if (allowedOriginsPattern.test(origin)  ||  !origin) { 
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // Methods allowed in the CORS request
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Headers allowed in the CORS request
  credentials: true,
}));

// Apply JSON middleware
app.use(express.json());

// Apply routes after CORS middleware
app.use(router);

// use port in the config file, but if port is empty, put it 3001
const port = config().port;

// Configure database connection
export const pool = createPool({
  host: config().host,
  user: config().root,
  password: config().pass,
  database: config().db, 
});

// In case of 'localhost' or '127.0.0.1', listen on '0.0.0.0' to be accessible on the whole network.
// Otherwise, listen on 'localhost' to be accessible only on the local machine.
// If 0.0.0.0 use the IP of the machine
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});