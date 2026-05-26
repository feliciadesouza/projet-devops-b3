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

const PORT = process.env.PORT || 3000;

function startServer() {
  app.listen(PORT, () => {
    console.log(`🏥 DiabèteTrack Server running on port ${PORT}`);
  });
}

sequelize
  .sync({ alter: true })
  .then(() => console.log('✅ Base de données synchronisée'))
  .catch((err) => console.error('❌ Erreur DB:', err.message))
  .finally(() => startServer());

module.exports = app;