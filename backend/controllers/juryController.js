// backend/controllers/juryController.js
const supabase = require('../utils/supabaseClient');

// Attribution d'une note par un jury pour une équipe
// Cette fonction est également dans projectController, mais peut être exposée spécifiquement pour le jury si nécessaire
exports.assignScoreToProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { score } = req.body;

        if (typeof score !== 'number' || score < 0 || score > 100) {
            return res.status(400).json({ message: 'Score must be a number between 0 and 100.' });
        }

        const { data, error } = await supabase
            .from('projects')
            .update({ score })
            .eq('id', projectId)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        res.status(200).json(data[0]);
    } catch (error) {
        console.error('Error assigning score to project (jury):', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les projets pour notation par le jury (peut être filtré par hackathon)
exports.getProjectsForJuryReview = async (req, res) => {
    try {
        const { hackathonId } = req.query;
        let query = supabase.from('projects').select(`
            *,
            hackathons(name),
            project_teams(
                participant:participants(id, name, email),
                role
            )
        `).order('name', { ascending: true });

        if (hackathonId) {
            query = query.eq('hackathon_id', hackathonId);
        }

        const { data, error } = await query;

        if (error) throw error;

        const projectsWithFormattedTeams = data.map(project => ({
            ...project,
            hackathon_name: project.hackathons?.name || 'N/A', // Flatten hackathon name
            team: project.project_teams.map(pt => ({
                participant: pt.participant,
                role: pt.role
            }))
        }));
        res.status(200).json(projectsWithFormattedTeams);
    } catch (error) {
        console.error('Error fetching projects for jury review:', error);
        res.status(500).json({ message: error.message });
    }
};

// Valider les podiums (logique plus complexe à implémenter, ici un exemple simple)
exports.validatePodiums = async (req, res) => {
    try {
        const { hackathonId } = req.params;
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                project_teams(
                    participant:participants(id, name)
                )
            `)
            .eq('hackathon_id', hackathonId)
            .order('score', { ascending: false }) // Trie par score décroissant
            .limit(3); // Prend les 3 meilleurs

        if (error) throw error;
        if (!data.length) {
            return res.status(404).json({ message: 'No projects found for this hackathon to determine podiums.' });
        }

        const podiumProjects = data.map(project => ({
            ...project,
            team: project.project_teams.map(pt => ({
                participant: pt.participant,
                role: pt.role // role might not be directly available if not selected
            }))
        }));

        res.status(200).json({ message: 'Podiums determined successfully', podium: podiumProjects });
    } catch (error) {
        console.error('Error validating podiums:', error);
        res.status(500).json({ message: error.message });
    }
};