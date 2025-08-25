import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

class NavigationManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Wait for Firebase to be initialized
        if (window.firebaseAuth) {
            this.checkAuthState();
        } else {
            // Wait for Firebase to load
            setTimeout(() => this.init(), 100);
        }
    }

    checkAuthState() {
        onAuthStateChanged(window.firebaseAuth, (user) => {
            this.currentUser = user;
            this.updateNavigation();
        });
    }

    updateNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        // Remove existing auth links
        const existingAuthLinks = nav.querySelectorAll('.auth-link, .profile-link');
        existingAuthLinks.forEach(link => link.remove());

        if (this.currentUser) {
            // User is logged in - show profile link
            this.addProfileLink(nav);
        } else {
            // User is not logged in - show login link
            this.addLoginLink(nav);
        }
    }

    addLoginLink(nav) {
        const loginLink = document.createElement('a');
        loginLink.href = 'login.html';
        loginLink.textContent = 'Login';
        loginLink.className = 'auth-link';
        
        // Add active class if on login page
        if (window.location.pathname.includes('login.html')) {
            loginLink.classList.add('active');
        }
        
        nav.appendChild(loginLink);
    }

    addProfileLink(nav) {
        const profileLink = document.createElement('a');
        profileLink.href = 'profile.html';
        profileLink.textContent = 'Profil';
        profileLink.className = 'profile-link';
        
        // Add active class if on profile page
        if (window.location.pathname.includes('profile.html')) {
            profileLink.classList.add('active');
        }
        
        nav.appendChild(profileLink);
    }
}

// Initialize navigation manager
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});
