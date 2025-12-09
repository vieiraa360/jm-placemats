import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { networkInterfaces } from 'os';
import contactRoutes from './routes/contactRoutes.js';
import productRoutes from './routes/productRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import { testEmail } from './controllers/emailController.js';

dotenv.config();

// Helper function to get local IP address
function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS configuration - allow requests from frontend
const localIP = getLocalIP();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3001',
  'http://localhost:5173', // Vite default port
  'http://localhost:5174',
  'http://localhost:3000',
  // Production domain
  'https://jm-placemats.com',
  'https://www.jm-placemats.com',
  // Allow connections from same network (local IP)
  `http://${localIP}:3001`,
  `http://${localIP}:5173`,
  `http://${localIP}:5174`,
  `http://${localIP}:3000`
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all local network connections
    if (process.env.NODE_ENV === 'development') {
      // Allow localhost and local network IPs
      if (origin.includes('localhost') || 
          origin.includes('127.0.0.1') || 
          origin.includes(localIP) ||
          origin.startsWith('http://192.168.') ||
          origin.startsWith('http://10.') ||
          origin.startsWith('http://172.')) {
        return callback(null, true);
      }
    }
    
    // Check if origin matches allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For production domain, allow it even if not in list (if NODE_ENV is production)
      if (process.env.NODE_ENV === 'production' && 
          (origin === 'https://jm-placemats.com' || origin === 'https://www.jm-placemats.com')) {
        return callback(null, true);
      }
      
      // Allow Cloudflare tunnel domain if accessing from production
      if (origin && origin.includes('jm-placemats.com')) {
        return callback(null, true);
      }
      
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Stripe webhook endpoint - must be before JSON body parser
// Stripe needs raw body for signature verification
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Regular JSON body parser for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stripe', stripeRoutes);

// Email test endpoint (for debugging)
app.post('/api/test-email', testEmail);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jm-placemats')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Start server after DB connection
    // Listen on 0.0.0.0 to accept connections from other machines on the network
    const HOST = process.env.HOST || '0.0.0.0';
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌐 Server accessible on network at http://${getLocalIP()}:${PORT}`);
      console.log(`📧 Email relay configured`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

