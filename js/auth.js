export const auth = {
    // Save user in localStorage
    saveSession(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Get current user
    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    // Log out
    logout() {
        localStorage.removeItem('user');
        window.location.reload(); // Reload to clear the SPA state
    },

    // Check if user is authenticated
    isAuthenticated() {
        return this.getUser() !== null;
    }
};