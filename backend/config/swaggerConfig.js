const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Spécification OpenAPI version 3
    info: {
      title: 'HackaPlan API', // Titre de votre API
      version: '1.0.0', // Version de votre API
      description: 'API pour gérer le cycle de vie des hackathons (participants, projets, jurys).'
    },
    servers: [
      {
        url: 'http://localhost:3000', // L'URL de base de votre API locale
        description: 'Serveur de développement local',
      },
      // Vous pouvez ajouter d'autres serveurs pour la production, etc.
      // {
      //   url: 'https://api.hackaplan.com',
      //   description: 'Serveur de production',
      // },
    ],
  },
  // Spécifie où trouver les fichiers JSDoc pour générer la documentation
  // Adaptez ces chemins pour qu'ils pointent vers vos fichiers de routes et de contrôleurs
  apis: [
    './routes/*.js',       // Ex: backend/routes/projectRoutes.js, backend/routes/participantRoutes.js
    './controllers/*.js'   // Ex: backend/controllers/projectController.js
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;