const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');

/**
 * @swagger
 * /api/participants:
 *   post:
 *     summary: Enregistrer un nouveau participant
 *     description: Crée un nouveau participant avec un nom, un email et des compétences.
 *     tags:
 *       - Participants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom complet du participant.
 *                 example: "Alice Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email unique du participant.
 *                 example: "alice.dupont@example.com"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des compétences du participant (optionnel).
 *                 example: ["JavaScript", "Angular", "Node.js"]
 *               bio:
 *                 type: string
 *                 description: Biographie courte du participant.
 *                 example: "Développeur full-stack passionné par les nouvelles technologies"
 *               avatar:
 *                 type: string
 *                 description: URL de l'avatar du participant.
 *                 example: "https://example.com/avatar.jpg"
 *               github:
 *                 type: string
 *                 description: Nom d'utilisateur GitHub.
 *                 example: "alice-dev"
 *               linkedin:
 *                 type: string
 *                 description: URL du profil LinkedIn.
 *                 example: "https://linkedin.com/in/alice-dupont"
 *     responses:
 *       201:
 *         description: Participant enregistré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID unique du participant.
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 bio:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 github:
 *                   type: string
 *                 linkedin:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 id: "part-123"
 *                 name: "Alice Dupont"
 *                 email: "alice.dupont@example.com"
 *                 skills: ["JavaScript", "Angular", "Node.js"]
 *                 bio: "Développeur full-stack passionné"
 *                 avatar: "https://example.com/avatar.jpg"
 *                 github: "alice-dev"
 *                 linkedin: "https://linkedin.com/in/alice-dupont"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Requête invalide (données manquantes ou mal formatées).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "L'email est requis et doit être valide"
 *       409:
 *         description: Conflit - Email déjà utilisé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Un participant avec cet email existe déjà"
 *       500:
 *         description: Erreur serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.post('/', participantController.createParticipant);

/**
 * @swagger
 * /api/participants:
 *   get:
 *     summary: Récupérer tous les participants
 *     description: Retourne la liste de tous les participants enregistrés avec pagination et filtres.
 *     tags:
 *       - Participants
 *     parameters:
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Filtrer par compétences (séparées par des virgules).
 *         example: "JavaScript,React"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Rechercher par nom ou email.
 *         example: "Alice"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Nombre maximum de participants à retourner.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Nombre de participants à ignorer (pour la pagination).
 *     responses:
 *       200:
 *         description: Liste des participants récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: string
 *                       bio:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       github:
 *                         type: string
 *                       linkedin:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   description: Nombre total de participants correspondant aux critères
 *                 limit:
 *                   type: integer
 *                   description: Limite appliquée à la requête
 *                 offset:
 *                   type: integer
 *                   description: Décalage appliqué à la requête
 *             example:
 *               participants:
 *                 - id: "part-123"
 *                   name: "Alice Dupont"
 *                   email: "alice.dupont@example.com"
 *                   skills: ["JavaScript", "React", "Node.js"]
 *                   bio: "Développeur full-stack passionné"
 *                   avatar: "https://example.com/avatar1.jpg"
 *                   github: "alice-dev"
 *                   linkedin: "https://linkedin.com/in/alice-dupont"
 *                   createdAt: "2024-01-15T10:30:00Z"
 *                   updatedAt: "2024-01-15T10:30:00Z"
 *               total: 1
 *               limit: 20
 *               offset: 0
 *       500:
 *         description: Erreur serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la récupération des participants"
 */
router.get('/', participantController.getAllParticipants);

/**
 * @swagger
 * /api/participants/{id}:
 *   get:
 *     summary: Récupérer un participant spécifique
 *     description: Retourne les détails d'un participant par son ID.
 *     tags:
 *       - Participants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du participant
 *         example: "part-123"
 *     responses:
 *       200:
 *         description: Participant récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 bio:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 github:
 *                   type: string
 *                 linkedin:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Participant non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Participant non trouvé"
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:id', participantController.getParticipant);

/**
 * @swagger
 * /api/participants/{id}:
 *   put:
 *     summary: Mettre à jour un participant
 *     description: Met à jour les informations d'un participant existant.
 *     tags:
 *       - Participants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du participant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *               github:
 *                 type: string
 *               linkedin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Participant mis à jour avec succès.
 *       400:
 *         description: Requête invalide.
 *       404:
 *         description: Participant non trouvé.
 *       409:
 *         description: Conflit - Email déjà utilisé par un autre participant.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/:id', participantController.updateParticipant);

/**
 * @swagger
 * /api/participants/{id}:
 *   delete:
 *     summary: Supprimer un participant
 *     description: Supprime un participant existant.
 *     tags:
 *       - Participants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du participant
 *     responses:
 *       204:
 *         description: Participant supprimé avec succès.
 *       404:
 *         description: Participant non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.delete('/:id', participantController.deleteParticipant);

/**
 * @swagger
 * /api/participants/{id}/projects:
 *   get:
 *     summary: Récupérer les projets d'un participant
 *     description: Retourne la liste des projets auxquels un participant est associé.
 *     tags:
 *       - Participants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du participant
 *     responses:
 *       200:
 *         description: Liste des projets du participant.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   hackathonId:
 *                     type: string
 *                   role:
 *                     type: string
 *                     description: Rôle du participant dans ce projet
 *       404:
 *         description: Participant non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:id/projects', participantController.getParticipantProjects);

module.exports = router;