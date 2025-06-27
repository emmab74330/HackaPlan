// backend/routes/juryRoutes.js
const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');

router.patch('/projects/:projectId/score', juryController.assignScoreToProject); // Jury assigns score
router.get('/projects-for-review', juryController.getProjectsForJuryReview); // Get projects for jury review
router.post('/hackathons/:hackathonId/validate-podiums', juryController.validatePodiums); // Validate podiums

module.exports = router;