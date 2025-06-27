const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Créer un nouveau projet
 *     description: Permet aux organisateurs de créer un nouveau projet pour un hackathon.
 *     tags:
 *       - Projets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - hackathonId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du projet.
 *                 example: "Application de gestion de tâches pour HackaPlan"
 *               description:
 *                 type: string
 *                 description: Description détaillée du projet.
 *                 example: "Une application web pour organiser les tâches au sein des équipes de hackathon."
 *               hackathonId:
 *                 type: string
 *                 description: ID du hackathon auquel le projet appartient.
 *                 example: "uuid-du-hackathon-123"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associés au projet.
 *                 example: ["web", "mobile", "ai"]
 *               teamMembers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     participantId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 description: Membres de l'équipe du projet.
 *     responses:
 *       201:
 *         description: Projet créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 hackathonId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 id: "proj-456"
 *                 title: "Application de gestion de tâches"
 *                 description: "Une application web..."
 *                 hackathonId: "uuid-du-hackathon-123"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Requête invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Le titre du projet est requis"
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
router.post('/', projectController.createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Récupérer la liste des projets
 *     description: Retourne la liste de tous les projets, éventuellement filtrée par hackathonId.
 *     tags:
 *       - Projets
 *     parameters:
 *       - in: query
 *         name: hackathonId
 *         schema:
 *           type: string
 *         description: ID du hackathon pour filtrer les projets.
 *         example: "uuid-du-hackathon-123"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, in-progress, completed, submitted]
 *         description: Statut du projet pour filtrer les résultats.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Nombre maximum de projets à retourner.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Nombre de projets à ignorer (pour la pagination).
 *     responses:
 *       200:
 *         description: Liste des projets récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       hackathonId:
 *                         type: string
 *                       score:
 *                         type: number
 *                         format: float
 *                         nullable: true
 *                       status:
 *                         type: string
 *                         enum: [draft, in-progress, completed, submitted]
 *                       teamMembers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             participantId:
 *                               type: string
 *                             name:
 *                               type: string
 *                             role:
 *                               type: string
 *                             avatar:
 *                               type: string
 *                               nullable: true
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   description: Nombre total de projets correspondant aux critères
 *                 limit:
 *                   type: integer
 *                   description: Limite appliquée à la requête
 *                 offset:
 *                   type: integer
 *                   description: Décalage appliqué à la requête
 *             example:
 *               projects:
 *                 - id: "proj-456"
 *                   title: "Application de gestion de tâches"
 *                   description: "Une application web..."
 *                   hackathonId: "uuid-du-hackathon-123"
 *                   score: 85.5
 *                   status: "in-progress"
 *                   teamMembers:
 *                     - participantId: "user-123"
 *                       name: "Alice Dupont"
 *                       role: "Lead Developer"
 *                       avatar: "https://example.com/avatar1.jpg"
 *                   tags: ["web", "productivity"]
 *                   createdAt: "2024-01-15T10:30:00Z"
 *                   updatedAt: "2024-01-15T11:45:00Z"
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
 *                   example: "Erreur lors de la récupération des projets"
 */
router.get('/', projectController.getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Récupérer un projet spécifique
 *     description: Retourne les détails d'un projet par son ID.
 *     tags:
 *       - Projets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du projet
 *         example: "proj-456"
 *     responses:
 *       200:
 *         description: Projet récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 hackathonId:
 *                   type: string
 *                 score:
 *                   type: number
 *                   format: float
 *                   nullable: true
 *                 status:
 *                   type: string
 *                   enum: [draft, in-progress, completed, submitted]
 *                 teamMembers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       participantId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                         nullable: true
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Projet non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Projet non trouvé"
 *       500:
 *         description: Erreur serveur.
 */
router.get('/:id', projectController.getProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Mettre à jour un projet
 *     description: Met à jour les informations d'un projet existant.
 *     tags:
 *       - Projets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, in-progress, completed, submitted]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               teamMembers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     participantId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès.
 *       404:
 *         description: Projet non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.put('/:id', projectController.updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Supprimer un projet
 *     description: Supprime un projet existant.
 *     tags:
 *       - Projets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du projet
 *     responses:
 *       204:
 *         description: Projet supprimé avec succès.
 *       404:
 *         description: Projet non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.delete('/:id', projectController.deleteProject);

module.exports = router;