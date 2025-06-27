// backend/controllers/participantController.js
const supabase = require('../utils/supabaseClient');

// Inscription d'un nouveau participant
exports.createParticipant = async (req, res) => {
    try {
        const { name, email, skills } = req.body;

        // Vérifier si l'email existe déjà
        const { data: existingParticipant, error: existingError } = await supabase
            .from('participants')
            .select('id')
            .eq('email', email)
            .single();

        if (existingParticipant) {
            return res.status(409).json({ message: 'Participant with this email already exists.' });
        }
        if (existingError && existingError.code !== 'PGRST116') { // PGRST116: No rows found
            throw existingError;
        }

        const { data, error } = await supabase
            .from('participants')
            .insert([{ name, email, skills }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error creating participant:', error);
        res.status(400).json({ message: error.message });
    }
};

// Permet à un participant de s'inscrire à un projet
exports.registerForProject = async (req, res) => {
    try {
        const { participantId, projectId } = req.body;

        // Vérifier si le participant existe
        const { data: participant, error: participantError } = await supabase
            .from('participants')
            .select('id')
            .eq('id', participantId)
            .single();
        if (participantError || !participant) {
            return res.status(404).json({ message: 'Participant not found.' });
        }

        // Vérifier si le projet existe
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .single();
        if (projectError || !project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Vérifier si le participant est déjà dans l'équipe du projet
        const { data: existingTeamMember, error: teamError } = await supabase
            .from('project_teams')
            .select('id')
            .eq('project_id', projectId)
            .eq('participant_id', participantId)
            .single();

        if (existingTeamMember) {
            return res.status(409).json({ message: 'Participant is already registered for this project.' });
        }
        if (teamError && teamError.code !== 'PGRST116') { // PGRST116: No rows found
            throw teamError;
        }

        // Ajouter le participant à l'équipe du projet
        const { data: teamData, error: insertTeamError } = await supabase
            .from('project_teams')
            .insert([{ project_id: projectId, participant_id: participantId, role: 'Member' }])
            .select();

        if (insertTeamError) throw insertTeamError;

        res.status(200).json({ message: 'Successfully registered for project and joined team!', teamMember: teamData[0] });
    } catch (error) {
        console.error('Error registering participant for project:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtenir tous les participants
exports.getAllParticipants = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('participants')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching all participants:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un participant par ID
exports.getParticipantById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('participants')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ message: 'Participant not found.' });

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching participant by ID:', error);
        res.status(500).json({ message: error.message });
    }
};