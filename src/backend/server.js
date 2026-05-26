const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const corsOrigins = require('./config/corsOrigins');
app.use(cors({ origin: corsOrigins(), credentials: true }));
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
  const server = app.listen(PORT, () => {
    console.log(`🏥 DiabèteTrack Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Le port ${PORT} est déjà utilisé.`);
      console.error('   → Arrêtez le backend Docker : docker stop docker-backend-1');
      console.error('   → Ou changez PORT dans src/backend/.env (ex. 3002)');
      process.exit(1);
    }
    throw err;
  });
}

sequelize
  .sync({ alter: true })
  .then(() => console.log('✅ Base de données synchronisée'))
  .catch((err) => console.error('❌ Erreur DB:', err.message))
  .finally(() => startServer());

module.exports = app;