// controllers/projectController.js
// This file will contain the logic for handling project-related requests.

/**
 * @desc Creates a new project.
 * @route POST /api/projects
 * @access Public (or appropriate authentication/authorization)
 */
exports.createProject = async (req, res) => {
    try {
        // Extract project data from the request body
        const { title, description, hackathonId, tags, teamMembers } = req.body;

        // --- Add your project creation logic here ---
        // Example: Save the project to a database (e.g., MongoDB, PostgreSQL)
        // const newProject = await Project.create({
        //     title,
        //     description,
        //     hackathonId,
        //     tags: tags || [], // Default to empty array if no tags provided
        //     teamMembers: teamMembers || [], // Default to empty array if no teamMembers
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        //     status: 'draft', // Initial status
        //     score: null // No score initially
        // });

        // For now, we'll return a mock response
        const newProject = {
            id: 'proj-' + Math.random().toString(36).substr(2, 9), // Generate a mock ID
            title,
            description,
            hackathonId,
            tags: tags || [],
            teamMembers: teamMembers || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'draft',
            score: null
        };

        // Send a success response
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        // Handle validation errors or database errors
        res.status(400).json({ error: error.message || 'Failed to create project.' });
    }
};

/**
 * @desc Retrieves a list of all projects, with optional filtering and pagination.
 * @route GET /api/projects
 * @access Public
 */
exports.getProjects = async (req, res) => {
    try {
        // Extract query parameters for filtering and pagination
        const { hackathonId, status, limit = 20, offset = 0 } = req.query;

        // Build query conditions based on parameters
        const queryConditions = {};
        if (hackathonId) {
            queryConditions.hackathonId = hackathonId;
        }
        if (status) {
            queryConditions.status = status;
        }

        // --- Add your project fetching logic here ---
        // Example: Fetch projects from a database
        // const projects = await Project.find(queryConditions)
        //     .skip(parseInt(offset))
        //     .limit(parseInt(limit));
        // const total = await Project.countDocuments(queryConditions);

        // For now, we'll return mock data.
        // In a real application, you'd fetch from your database.
        const mockProjects = [
            {
                id: "proj-456",
                title: "Application de gestion de tâches",
                description: "Une application web pour organiser les tâches au sein des équipes de hackathon.",
                hackathonId: "uuid-du-hackathon-123",
                score: 85.5,
                status: "in-progress",
                teamMembers: [
                    { participantId: "user-123", name: "Alice Dupont", role: "Lead Developer", avatar: "https://placehold.co/50x50/aabbcc/ffffff?text=AD" }
                ],
                tags: ["web", "productivity"],
                createdAt: "2024-01-15T10:30:00Z",
                updatedAt: "2024-01-15T11:45:00Z"
            },
            {
                id: "proj-789",
                title: "Outil d'analyse de données",
                description: "Un script Python pour analyser les données des participants.",
                hackathonId: "uuid-du-hackathon-123",
                score: null,
                status: "draft",
                teamMembers: [
                    { participantId: "user-456", name: "Bob Martin", role: "Data Scientist", avatar: "https://placehold.co/50x50/ccbbaa/ffffff?text=BM" }
                ],
                tags: ["python", "data-science", "ai"],
                createdAt: "2024-01-16T09:00:00Z",
                updatedAt: "2024-01-16T09:00:00Z"
            }
        ];

        // Filter mock projects based on query parameters
        const filteredProjects = mockProjects.filter(project => {
            let match = true;
            if (hackathonId && project.hackathonId !== hackathonId) {
                match = false;
            }
            if (status && project.status !== status) {
                match = false;
            }
            return match;
        });

        // Apply pagination
        const paginatedProjects = filteredProjects.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
        const total = filteredProjects.length;

        // Send a success response with the projects and pagination info
        res.status(200).json({
            projects: paginatedProjects,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
    }
};

/**
 * @desc Retrieves a single project by its ID.
 * @route GET /api/projects/:id
 * @access Public
 */
exports.getProject = async (req, res) => {
    try {
        const { id } = req.params;

        // --- Add your logic to fetch a single project by ID here ---
        // Example: const project = await Project.findById(id);

        // For now, we'll return a mock project if the ID matches 'proj-456'
        if (id === "proj-456") {
            const project = {
                id: "proj-456",
                title: "Application de gestion de tâches",
                description: "Une application web pour organiser les tâches au sein des équipes de hackathon.",
                hackathonId: "uuid-du-hackathon-123",
                score: 85.5,
                status: "in-progress",
                teamMembers: [
                    { participantId: "user-123", name: "Alice Dupont", role: "Lead Developer", avatar: "https://placehold.co/50x50/aabbcc/ffffff?text=AD" }
                ],
                tags: ["web", "productivity"],
                createdAt: "2024-01-15T10:30:00Z",
                updatedAt: "2024-01-15T11:45:00Z"
            };
            return res.status(200).json(project);
        } else {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

/**
 * @desc Updates an existing project.
 * @route PUT /api/projects/:id
 * @access Public (or appropriate authentication/authorization)
 */
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, tags, teamMembers } = req.body;

        // --- Add your project update logic here ---
        // Example: Find the project by ID and update it
        // const updatedProject = await Project.findByIdAndUpdate(id, {
        //     title, description, status, tags, teamMembers, updatedAt: new Date()
        // }, { new: true }); // { new: true } returns the updated document

        // For now, we'll return a mock updated project if the ID matches 'proj-456'
        if (id === "proj-456") {
            const updatedProject = {
                id: "proj-456",
                title: title || "Application de gestion de tâches",
                description: description || "Une application web...",
                hackathonId: "uuid-du-hackathon-123",
                score: 85.5, // Assuming score doesn't change on general update
                status: status || "in-progress",
                teamMembers: teamMembers || [
                    { participantId: "user-123", name: "Alice Dupont", role: "Lead Developer", avatar: "https://placehold.co/50x50/aabbcc/ffffff?text=AD" }
                ],
                tags: tags || ["web", "productivity"],
                createdAt: "2024-01-15T10:30:00Z",
                updatedAt: new Date().toISOString() // Update timestamp
            };
            return res.status(200).json(updatedProject);
        } else {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

/**
 * @desc Deletes a project by its ID.
 * @route DELETE /api/projects/:id
 * @access Public (or appropriate authentication/authorization)
 */
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // --- Add your project deletion logic here ---
        // Example: const deletedProject = await Project.findByIdAndDelete(id);

        // For now, we'll simulate deletion.
        if (id === "proj-456") {
            // In a real app, you'd check if the project was actually deleted
            return res.status(204).send(); // 204 No Content for successful deletion
        } else {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};
