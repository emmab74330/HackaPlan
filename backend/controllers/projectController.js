// backend/controllers/projectController.js
const supabase = require('../utils/supabaseClient');

// Création d'un nouveau projet (Organisateur)
exports.createProject = async (req, res) => {
    try {
        const { name, description, hackathonId } = req.body;

        // Optionnel: Vérifier si le hackathon existe
        const { data: hackathon, error: hackathonError } = await supabase
            .from('hackathons')
            .select('id')
            .eq('id', hackathonId)
            .single();

        if (hackathonError || !hackathon) {
            return res.status(404).json({ message: 'Hackathon not found.' });
        }

        const { data, error } = await supabase
            .from('projects')
            .insert([{ name, description, hackathon_id: hackathonId }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(400).json({ message: error.message });
    }
};

// Affichage de la liste des projets retenus pour un hackathon donné
exports.getProjectsByHackathon = async (req, res) => {
    try {
        const { hackathonId } = req.params;
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                project_teams(
                    participant:participants(id, name, email),
                    role
                )
            `)
            .eq('hackathon_id', hackathonId)
            .order('name', { ascending: true });

        if (error) throw error;

        const projectsWithFormattedTeams = data.map(project => ({
            ...project,
            team: project.project_teams.map(pt => ({
                participant: pt.participant,
                role: pt.role
            }))
        }));
        res.status(200).json(projectsWithFormattedTeams);
    } catch (error) {
        console.error('Error fetching projects by hackathon:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un projet par ID
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                project_teams(
                    participant:participants(id, name, email),
                    role
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ message: 'Project not found.' });

        // Flatten the team structure
        const projectWithFormattedTeam = {
            ...data,
            team: data.project_teams.map(pt => ({
                participant: pt.participant,
                role: pt.role
            }))
        };

        res.status(200).json(projectWithFormattedTeam);
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        res.status(500).json({ message: error.message });
    }
};

// Attribution d'une note par un jury pour une équipe
exports.assignScore = async (req, res) => {
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
        console.error('Error assigning score:', error);
        res.status(500).json({ message: error.message });
    }
};