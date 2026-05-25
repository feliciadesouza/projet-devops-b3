const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/glycemies', require('./routes/glycemies'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DiabèteTrack API is running' });
});

// Sync DB and start server
const sequelize = require('./config/database');
require('./models/index');

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base de données synchronisée');
  app.listen(process.env.PORT || 3000, () => {
    console.log(`🏥 DiabèteTrack Server running on port ${process.env.PORT || 3000}`);
  });
}).catch(e => console.log('❌ Erreur DB:', e.message));

module.exports = app;