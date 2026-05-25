const { Patient, User } = require('../models/index');
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      where: { medecinId: req.user.id },
      include: [{
        model: User,
        attributes: ['nom', 'prenom', 'email']
      }]
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id, {
      include: [{
        model: User,
        attributes: ['nom', 'prenom', 'email']
      }]
    });
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { userId, dateNaissance, typeDiabete, telephone } = req.body;
    const patient = await Patient.create({
      userId,
      medecinId: req.user.id,
      dateNaissance,
      typeDiabete,
      telephone,
    });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateNaissance, typeDiabete, telephone } = req.body;
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    await patient.update({ dateNaissance, typeDiabete, telephone });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getMyPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ where: { userId: req.user.id } });
    if (!patient) return res.status(404).json({ message: 'Patient non trouvé' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};