import { auth } from './auth.js';
import { api } from './api.js';
import { renderLogin, renderDashboard, renderProjectCard, renderStats, renderCreateForm, renderEditForm } from './views.js';

const app = document.getElementById('app');
const navbar = document.getElementById('navbar');
const logoutBtn = document.getElementById('logout-btn');

/**
 * 1. ROUTER: Decide which view to display
 */
async function router() {
    const user = auth.getUser();

    if (!user) {
        navbar.classList.add('d-none');
        app.innerHTML = renderLogin();
        setupLoginListeners();
    } else {
        navbar.classList.remove('d-none');
        app.innerHTML = renderDashboard(user);
        await loadDashboardData(user); 
    }
}

/**
 * 2. LOGIN: Login logic
 */
function setupLoginListeners() {
    const loginForm = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const user = await api.login(email, password);
                auth.saveSession(user);
                router(); 
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.classList.remove('d-none');
            }
        });
    }
}

/**
 * 3. DATA LOADING: Projects and Statistics
 */
async function loadDashboardData(user) {
    const projectsContainer = document.getElementById('projects-list');
    const statsContainer = document.getElementById('stats-container');

    try {
        const userId = user.role === 'collaborator' ? user.id : null;
        const projects = await api.getProjects(userId);

        const stats = {
            total: projects.length,
            active: projects.filter(p => p.status === 'In Progress').length,
            completed: projects.filter(p => p.status === 'Completed').length
        };

        statsContainer.innerHTML = renderStats(stats);

        if (projects.length === 0) {
            projectsContainer.innerHTML = '<p class="text-center mt-4">No projects available.</p>';
        } else {
            projectsContainer.innerHTML = projects
                .map(p => renderProjectCard(p, user.role))
                .join('');
        }
        
        setupProjectActions(user); 

    } catch (error) {
        console.error(error);
        projectsContainer.innerHTML = '<p class="text-danger">Error loading data.</p>';
    }
}

/**
 * 4. ACTIONS: Button logic (Create, Delete, Edit)
 */
function setupProjectActions(user) {
    const projectsContainer = document.getElementById('projects-list');

    // Event delegation for Cards (Delete and Edit)
    projectsContainer.onclick = async (e) => {
        
        // --- DELETE LOGIC ---
        const btnDelete = e.target.closest('.btn-delete');

        if (btnDelete) {
            const id = btnDelete.dataset.id;

            if (confirm("Are you sure you want to delete this project?")) {
                await api.deleteProject(id);
                router();
            }

            return;
        }

        // --- EDIT / UPDATE STATUS LOGIC ---
        const btnEdit = e.target.closest('.btn-edit') || e.target.closest('.btn-status');

        if (btnEdit) {
            const id = btnEdit.dataset.id;
            
            // Find the project to populate the form
            const projects = await api.getProjects();
            const project = projects.find(p => p.id == id);

            // Open Edit Modal
            const modalDiv = document.createElement('div');
            modalDiv.innerHTML = renderEditForm(project, user.role === 'manager');
            document.body.appendChild(modalDiv);

            document.getElementById('close-modal-edit').onclick = () => modalDiv.remove();

            const editForm = document.getElementById('edit-project-form');

            editForm.onsubmit = async (event) => {
                event.preventDefault();
                
                const updatedData = user.role === 'manager'
                    ? {
                        name: document.getElementById('edit-name').value,
                        description: document.getElementById('edit-desc').value,
                        status: document.getElementById('edit-status').value
                    }
                    : {
                        status: document.getElementById('edit-status').value
                    };

                await api.updateProject(id, updatedData);

                modalDiv.remove();
                router();
            };
        }
    };

    // --- CREATE PROJECT LOGIC (Manager only) ---
    const btnCreate = document.getElementById('btn-create');

    if (btnCreate) {
        btnCreate.onclick = () => {
            const modalDiv = document.createElement('div');

            modalDiv.innerHTML = renderCreateForm();
            document.body.appendChild(modalDiv);

            document.getElementById('close-modal').onclick = () => modalDiv.remove();

            const createForm = document.getElementById('create-project-form');

            createForm.onsubmit = async (event) => {
                event.preventDefault();

                const newProject = {
                    name: document.getElementById('p-name').value,
                    description: document.getElementById('p-desc').value,
                    status: document.getElementById('p-status').value,
                    assignedTo: document.getElementById('p-assigned').value,
                    createdAt: new Date().toLocaleDateString()
                };

                await api.createProject(newProject);

                modalDiv.remove();
                router();
            };
        };
    }
}

// Logout button
logoutBtn.onclick = () => auth.logout();

// Initialize app
router();