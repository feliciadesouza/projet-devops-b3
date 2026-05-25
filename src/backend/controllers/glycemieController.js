const Glycemie = require('../models/Glycemie');

exports.ajouterGlygemie = async (req, res) => {
  try {
    const { patientId, valeur, moment, date, commentaire } = req.body;

    if (valeur < 0.5 || valeur > 50) {
      return res.status(400).json({ message: 'Valeur de glycémie invalide' });
    }

    const glycemie = await Glycemie.create({
      patientId, valeur, moment, date, commentaire
    });

    let alerte = null;
    if (valeur < 3.9) alerte = '⚠️ Hypoglycémie détectée !';
    if (valeur > 10) alerte = '⚠️ Hyperglycémie détectée !';

    res.status(201).json({ glycemie, alerte });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getGlygemies = async (req, res) => {
  try {
    const { patientId } = req.params;
    const glycemies = await Glycemie.findAll({
      where: { patientId },
      order: [['date', 'DESC'], ['moment', 'ASC']],
    });
    res.json(glycemies);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateGlygemie = async (req, res) => {
  try {
    const { id } = req.params;
    const { valeur, moment, date, commentaire } = req.body;

    const glycemie = await Glycemie.findByPk(id);
    if (!glycemie) {
      return res.status(404).json({ message: 'Mesure non trouvée' });
    }

    await glycemie.update({ valeur, moment, date, commentaire });
    res.json(glycemie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteGlygemie = async (req, res) => {
  try {
    const { id } = req.params;
    const glycemie = await Glycemie.findByPk(id);
    if (!glycemie) {
      return res.status(404).json({ message: 'Mesure non trouvée' });
    }
    await glycemie.destroy();
    res.json({ message: 'Mesure supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};