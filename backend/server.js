
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Frontend Build Path
const frontendPath = path.join(
  __dirname,
  '../frontend/build'
);

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Frontend Path:', frontendPath);
console.log(
  'Frontend Build Exists:',
  fs.existsSync(frontendPath)
);

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(
      path.join(frontendPath, 'index.html')
    );
  });
} else {
  app.get('/', (req, res) => {
    res.send('ShopNest API is running. Frontend build not found.');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
