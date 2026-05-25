const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Glycemie = sequelize.define('Glycemie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valeur: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  moment: {
    type: DataTypes.ENUM('matin', 'midi', 'soir', 'nuit'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Glycemie;