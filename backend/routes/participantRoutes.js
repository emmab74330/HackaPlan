// backend/routes/participantRoutes.js
const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');

router.post('/', participantController.createParticipant);
router.post('/register-project', participantController.registerForProject);
router.get('/', participantController.getAllParticipants);
router.get('/:id', participantController.getParticipantById);

module.exports = router;