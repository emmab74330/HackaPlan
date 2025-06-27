// backend/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Pour parser les requêtes au format JSON

// Importation des routes
const hackathonRoutes = require('./routes/hackathonRoutes');
const projectRoutes = require('./routes/projectRoutes');
const participantRoutes = require('./routes/participantRoutes');
const juryRoutes = require('./routes/juryRoutes');

// Utilisation des routes
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/jury', juryRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send('HackaPlan API is running!');
});

// Gestion des erreurs (simple pour l'instant)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});