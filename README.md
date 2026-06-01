# Internal Project Management System (SPA)

## Description

This is a Single Page Application (SPA) designed for managing internal company projects. It features role-based access control (RBAC), allowing Managers to perform full CRUD operations on projects, while Collaborators can only view their assigned tasks and update their status.

---

## Technologies Used

* HTML5 & CSS3
* JavaScript (Vanilla ES6+ Modules)
* Bootstrap 5 (For UI components and responsiveness)
* JSON-Server (As a mock REST API)

---

## Installation & Setup

1. Clone or download the project files.

2. Install JSON-Server globally:

```bash
npm install -g json-server
```

---

## Running JSON Server

Before launching the application, you must run the mock server to handle data.

In the project folder, run:

```bash
json-server --watch db.json --port 3001
```

---

## Running the Project

1. Open the project folder in VS Code.
2. Launch the `index.html` file using a local server (like VS Code Live Server).
3. The application will be available at your local host address.

---

## Test Users

### Manager

* **Email:** `manager@test.com`
* **Password:** `123456`

### Collaborator

* **Email:** `user@test.com`
* **Password:** `123456`

---

## Role Permissions

### Manager

* Create, Edit, and Delete any project.
* View global statistics (Total, Active, and Completed projects).
* Full access to all projects in the database.

### Collaborator

* View only projects where their User ID matches the `assignedTo` field.
* Update **ONLY** the status of their assigned projects.
* Restricted from creating or deleting projects.

---

## Project Structure

```plaintext
/js/auth.js   -> Session management and localStorage handling.
/js/api.js    -> Service layer for all Fetch API calls (GET, POST, PATCH, DELETE).
/js/views.js  -> Template engine that generates dynamic HTML components.
/js/main.js   -> Core logic, router, and event orchestration.
```

---

## Technical Decisions

### Modular JavaScript

Used ES6 Modules to keep the code organized and avoid global scope pollution.

### Event Delegation

Implemented on the main project container to handle clicks on dynamically generated "Edit" and "Delete" buttons.

### PATCH Method

Used for updates to allow partial data modification, specifically for the Collaborator's status updates.

### Manual Filtering

Implemented client-side filtering to ensure reliable data matching between IDs regardless of their type (`String` or `Number`).

### Session Persistence

Used `localStorage` to comply with the requirement of maintaining the session after page refreshes.
