// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/', projectController.createProject);
router.get('/hackathon/:hackathonId', projectController.getProjectsByHackathon);
router.get('/:id', projectController.getProjectById);
router.patch('/:projectId/score', projectController.assignScore); // Assign score (used by jury)

module.exports = router;