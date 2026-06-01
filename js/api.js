const BASE_URL = 'http://localhost:3001';

export const api = {
    // 1. LOGIN (Manual search to avoid json-server errors)
    async login(email, password) {
        try {
            const response = await fetch(`${BASE_URL}/users`);
            const users = await response.json();
            
            const userFound = users.find(
                u => u.email === email.trim() && u.password === password.trim()
            );

            if (userFound) {
                return userFound;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            throw error;
        }
    },

    // 2. GET PROJECTS
    // 2. GET PROJECTS (Manual filtering for better security)
    async getProjects(userId = null) {
        try {
            const response = await fetch(`${BASE_URL}/projects`);

            if (!response.ok) {
                throw new Error('Error fetching projects');
            }

            const projects = await response.json();

            // If there is no userId, the user is a Manager, so return all projects.
            // If there is a userId, filter projects assigned to that ID.
            if (!userId) {
                return projects;
            } else {
                // Use .toString() to compare regardless of number or string type
                return projects.filter(
                    p => p.assignedTo.toString() === userId.toString()
                );
            }
        } catch (error) {
            console.error('Error in getProjects:', error);
            throw error;
        }
    },

    // 3. DELETE PROJECT
    async deleteProject(id) {
        try {
            const response = await fetch(`${BASE_URL}/projects/${id}`, {
                method: 'DELETE'
            });

            return response.ok;
        } catch (error) {
            throw error;
        }
    },

    // 4. CREATE PROJECT (This is the one we added!)
    async createProject(projectData) {
        try {
            const response = await fetch(`${BASE_URL}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // 5. UPDATE PROJECT (We’ll leave this ready for the next step)
    async updateProject(id, updatedData) {
        try {
            const response = await fetch(`${BASE_URL}/projects/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};