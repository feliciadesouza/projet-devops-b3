const User = require('./User');
const Patient = require('./Patient');
const Glycemie = require('./Glycemie');

// Associations
User.hasOne(Patient, { foreignKey: 'userId' });
Patient.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Patient, { foreignKey: 'medecinId', as: 'patients' });
Patient.belongsTo(User, { foreignKey: 'medecinId', as: 'medecin' });

Patient.hasMany(Glycemie, { foreignKey: 'patientId' });
Glycemie.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = { User, Patient, Glycemie };