const express = require('express');
const router = express.Router();
const glycemieController = require('../controllers/glycemieController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, glycemieController.ajouterGlygemie);
router.get('/patient/:patientId', authMiddleware, glycemieController.getGlygemies);
router.put('/:id', authMiddleware, glycemieController.updateGlygemie);
router.delete('/:id', authMiddleware, glycemieController.deleteGlygemie);

module.exports = router;