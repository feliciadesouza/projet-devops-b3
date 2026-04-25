const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await sequelize.query(`
      INSERT INTO "Users" (nom, prenom, email, password, role, "createdAt", "updatedAt")
      VALUES ('De Souza', 'Felicia', 'medecin@test.com', '${hashedPassword}', 'medecin', NOW(), NOW())
    `);
    
    console.log('✅ Médecin créé!');
    console.log('Email: medecin@test.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.log('Erreur:', error.message);
    process.exit(1);
  }
}

seed();