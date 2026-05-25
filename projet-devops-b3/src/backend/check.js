const sequelize = require('./config/database');

sequelize.query('SELECT email, role FROM "Users"')
  .then(r => {
    console.log('Utilisateurs:', r[0]);
    process.exit(0);
  })
  .catch(e => {
    console.log('Erreur:', e.message);
    process.exit(1);
  });