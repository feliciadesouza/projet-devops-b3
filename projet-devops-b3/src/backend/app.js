const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const glycemieRoutes = require('./routes/glycemies');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/glycemies', glycemieRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DiabèteTrack API is running' });
});

module.exports = app;