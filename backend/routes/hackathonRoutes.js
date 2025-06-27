// backend/routes/hackathonRoutes.js
const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathonController');

router.post('/', hackathonController.createHackathon);
router.get('/', hackathonController.getHackathons);
router.get('/:id/projects', hackathonController.getHackathonProjects);

module.exports = router;