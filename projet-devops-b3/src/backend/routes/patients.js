const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, patientController.getPatients);
router.get('/:id', authMiddleware, patientController.getPatient);
router.post('/', authMiddleware, patientController.createPatient);
router.put('/:id', authMiddleware, patientController.updatePatient);

module.exports = router;