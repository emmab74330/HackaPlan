// backend/controllers/hackathonController.js
const supabase = require('../utils/supabaseClient');

exports.createHackathon = async (req, res) => {
    try {
        const { name, description, startDate, endDate, status } = req.body;
        const { data, error } = await supabase
            .from('hackathons')
            .insert([{ name, description, start_date: startDate, end_date: endDate, status }])
            .select(); // Use .select() to return the inserted data

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error creating hackathon:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.getHackathons = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('hackathons')
            .select('*')
            .order('start_date', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching hackathons:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getHackathonProjects = async (req, res) => {
    try {
        const hackathonId = req.params.id;
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

        // Flatten the team structure for cleaner client-side use
        const projectsWithFormattedTeams = data.map(project => ({
            ...project,
            team: project.project_teams.map(pt => ({
                participant: pt.participant,
                role: pt.role
            }))
        }));

        res.status(200).json(projectsWithFormattedTeams);
    } catch (error) {
        console.error('Error fetching hackathon projects:', error);
        res.status(500).json({ message: error.message });
    }
};