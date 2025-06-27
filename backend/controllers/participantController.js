const { v4: uuidv4 } = require('uuid');

// Simulation d'une base de données en mémoire
let participants = [];

const participantController = {
  // Créer un nouveau participant
  createParticipant: async (req, res) => {
    try {
      const { name, email, skills, bio, avatar, github, linkedin } = req.body;

      // Validation des champs requis
      if (!name || !email) {
        return res.status(400).json({
          error: 'Le nom et l\'email sont requis'
        });
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'L\'email doit être valide'
        });
      }

      // Vérifier si l'email existe déjà
      const existingParticipant = participants.find(p => p.email === email);
      if (existingParticipant) {
        return res.status(409).json({
          error: 'Un participant avec cet email existe déjà'
        });
      }

      // Créer le nouveau participant
      const newParticipant = {
        id: uuidv4(),
        name,
        email,
        skills: skills || [],
        bio: bio || '',
        avatar: avatar || null,
        github: github || null,
        linkedin: linkedin || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      participants.push(newParticipant);

      res.status(201).json(newParticipant);
    } catch (error) {
      console.error('Erreur lors de la création du participant:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  },

  // Récupérer tous les participants avec filtres
  getAllParticipants: async (req, res) => {
    try {
      const { skills, search, limit = 20, offset = 0 } = req.query;
      
      let filteredParticipants = [...participants];

      // Filtrer par compétences si fourni
      if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
        filteredParticipants = filteredParticipants.filter(participant =>
          skillsArray.some(skill =>
            participant.skills.some(pSkill => 
              pSkill.toLowerCase().includes(skill)
            )
          )
        );
      }

      // Recherche textuelle si fournie
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredParticipants = filteredParticipants.filter(participant =>
          participant.name.toLowerCase().includes(searchTerm) ||
          participant.email.toLowerCase().includes(searchTerm)
        );
      }

      // Pagination
      const total = filteredParticipants.length;
      const paginatedParticipants = filteredParticipants.slice(
        parseInt(offset), 
        parseInt(offset) + parseInt(limit)
      );

      res.json({
        participants: paginatedParticipants,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des participants' });
    }
  },

  // Récupérer un participant spécifique
  getParticipant: async (req, res) => {
    try {
      const { id } = req.params;
      
      const participant = participants.find(p => p.id === id);
      
      if (!participant) {
        return res.status(404).json({ error: 'Participant non trouvé' });
      }

      res.json(participant);
    } catch (error) {
      console.error('Erreur lors de la récupération du participant:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  },

  // Mettre à jour un participant
  updateParticipant: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const participantIndex = participants.findIndex(p => p.id === id);
      
      if (participantIndex === -1) {
        return res.status(404).json({ error: 'Participant non trouvé' });
      }

      // Vérifier si l'email est modifié et s'il existe déjà
      if (updates.email && updates.email !== participants[participantIndex].email) {
        const existingParticipant = participants.find(p => p.email === updates.email);
        if (existingParticipant) {
          return res.status(409).json({
            error: 'Un participant avec cet email existe déjà'
          });
        }
      }

      // Mettre à jour le participant
      participants[participantIndex] = {
        ...participants[participantIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      res.json(participants[participantIndex]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du participant:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  },

  // Supprimer un participant
  deleteParticipant: async (req, res) => {
    try {
      const { id } = req.params;
      
      const participantIndex = participants.findIndex(p => p.id === id);
      
      if (participantIndex === -1) {
        return res.status(404).json({ error: 'Participant non trouvé' });
      }

      participants.splice(participantIndex, 1);
      
      res.status(204).send();
    } catch (error) {
      console.error('Erreur lors de la suppression du participant:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  },

  // Récupérer les projets d'un participant
  getParticipantProjects: async (req, res) => {
    try {
      const { id } = req.params;
      
      const participant = participants.find(p => p.id === id);
      
      if (!participant) {
        return res.status(404).json({ error: 'Participant non trouvé' });
      }

      // Cette fonction nécessiterait l'accès aux projets
      // Pour l'instant, on retourne un tableau vide
      // Dans une vraie application, on ferait une requête à la base de données
      const participantProjects = [];

      res.json(participantProjects);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets du participant:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
};

module.exports = participantController;