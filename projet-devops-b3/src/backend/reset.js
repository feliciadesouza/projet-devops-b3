const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');

async function reset() {
  try {
    const hash = await bcrypt.hash('password123', 10);
    await sequelize.query(`UPDATE "Users" SET password = '${hash}' WHERE email = 'medecin@test.com'`);
    console.log('✅ Mot de passe mis à jour!');
    process.exit(0);
  } catch (error) {
    console.log('Erreur:', error.message);
    process.exit(1);
  }
}

reset();