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
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DiabèteTrack API is running' });
});

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const glycemieRoutes = require('./routes/glycemies');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/glycemies', glycemieRoutes);

// Sync database
const sequelize = require('./config/database');
require('./models/index');

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Base de données synchronisée');
  }).catch(e => console.log('❌ Erreur DB:', e.message));
}

module.exports = app;