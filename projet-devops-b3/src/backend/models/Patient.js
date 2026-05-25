const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  medecinId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dateNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  typeDiabete: {
    type: DataTypes.ENUM('type1', 'type2', 'gestationnel'),
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Patient;