export const renderLogin = () => {
    return `
    <div class="row justify-content-center align-items-center vh-100">
        <div class="col-md-4">
            <div class="card shadow-lg">
                <div class="card-body p-5">
                    <h2 class="text-center mb-4">Log In</h2>
                    <form id="login-form">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email Address</label>
                            <!-- We changed the placeholder to something generic -->
                            <input type="email" class="form-control" id="email" required placeholder="name@company.com">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <!-- We changed the placeholder to dots -->
                            <input type="password" class="form-control" id="password" required placeholder="••••••••">
                        </div>
                        <div id="login-error" class="alert alert-danger d-none" role="alert"></div>
                        <button type="submit" class="btn btn-primary w-100 py-2">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
};

/**
 * Generates the base Dashboard structure
 */
export const renderDashboard = (user) => {
    return `
    <div class="row">
        <div class="col-12 mb-4">
            <h1>Welcome, ${user.name}</h1>
            <p class="badge ${user.role === 'manager' ? 'bg-danger' : 'bg-success'}">
                Role: ${user.role.toUpperCase()}
            </p>
        </div>
    </div>
    <div id="stats-container" class="row mb-4"></div>
    <div class="row">
        <div class="col-12 d-flex justify-content-between align-items-center mb-3">
            <h3>Projects</h3>
            ${user.role === 'manager' ? '<button class="btn btn-success" id="btn-create">New Project</button>' : ''}
        </div>
        <div class="col-12">
            <div id="projects-list" class="row g-3">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
            </div>
        </div>
    </div>
    `;
};

/**
 * Generates the card for an individual project
 */
export const renderProjectCard = (project, userRole) => {
    const actionButtons = userRole === 'manager' 
        ? `
            <button class="btn btn-sm btn-outline-primary btn-edit" data-id="${project.id}">Edit</button>
            <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${project.id}">Delete</button>
          `
        : `
            <button class="btn btn-sm btn-outline-info btn-status" data-id="${project.id}">Update Status</button>
          `;

    return `
    <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-start border-4 ${getStatusColor(project.status)} shadow-sm">
            <div class="card-body">
                <h5 class="card-title">${project.name}</h5>
                <p class="card-text text-muted small">${project.description}</p>
                <hr>
                <p class="mb-1"><strong>Status:</strong> ${project.status}</p>
                <p class="mb-1"><strong>Assigned To:</strong> ID ${project.assignedTo}</p>
                <div class="mt-3 d-flex gap-2">
                    ${actionButtons}
                </div>
            </div>
        </div>
    </div>
    `;
};

/**
 * Generates the statistics cards
 */
export const renderStats = (stats) => {
    return `
    <div class="col-md-4">
        <div class="card bg-primary text-white text-center p-3 mb-2">
            <h3>${stats.total}</h3>
            <span>Total Projects</span>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card bg-warning text-dark text-center p-3 mb-2">
            <h3>${stats.active}</h3>
            <span>In Progress</span>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card bg-success text-white text-center p-3 mb-2">
            <h3>${stats.completed}</h3>
            <span>Completed</span>
        </div>
    </div>
    `;
};

function getStatusColor(status) {
    if (!status) return 'border-secondary';
    switch (status.toLowerCase()) {
        case 'in progress': return 'border-warning';
        case 'completed': return 'border-success';
        case 'pending': return 'border-secondary';
        default: return 'border-primary';
    }
}

/**
 * Generates the HTML form for creating a project (Modal)
 */
export const renderCreateForm = () => {
    return `
    <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New Project</h5>
                    <button type="button" class="btn-close" id="close-modal"></button>
                </div>
                <div class="modal-body">
                    <form id="create-project-form">
                        <div class="mb-3">
                            <label class="form-label">Project Name</label>
                            <input type="text" id="p-name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea id="p-desc" class="form-control" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Initial Status</label>
                            <select id="p-status" class="form-select">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Assigned User ID (Collaborator)</label>
                            <input type="text" id="p-assigned" class="form-control" placeholder="Ex: 2" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Save Project</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
};

/**
 * Generates the edit form.
 * @param {Object} project - Current project data.
 * @param {Boolean} isManager - If true, enables all fields. If false, only status.
 */
export const renderEditForm = (project, isManager) => {
    return `
    <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${isManager ? 'Edit Project' : 'Update Status'}</h5>
                    <button type="button" class="btn-close" id="close-modal-edit"></button>
                </div>
                <div class="modal-body">
                    <form id="edit-project-form">
                        <div class="mb-3">
                            <label class="form-label">Name</label>
                            <input type="text" id="edit-name" class="form-control" value="${project.name}" ${!isManager ? 'disabled' : 'required'}>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea id="edit-desc" class="form-control" ${!isManager ? 'disabled' : 'required'}>${project.description}</textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <select id="edit-status" class="form-select">
                                <option value="Pending" ${project.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${project.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Completed" ${project.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
};