// Dynamic Navigation - Handles Login/Profile button state
import './google-auth.js';

class DynamicNavigation {
    constructor() {
        this.authNavLink = document.getElementById('auth-nav-link');
        this.authNavText = document.getElementById('auth-nav-text');
        this.currentUser = null;
        
        this.init();
    }
    
    init() {
        // Listen for auth state changes
        document.addEventListener('authStateChanged', (event) => {
            this.currentUser = event.detail.user;
            this.updateNavigationState();
        });
        
        // Handle click on auth nav link
        if (this.authNavLink) {
            this.authNavLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAuthNavClick();
            });
        }
        
        // Check initial auth state
        this.checkInitialAuthState();
    }
    
    checkInitialAuthState() {
        // Check if user is already logged in
        if (window.firebaseAuth && window.firebaseAuth.currentUser) {
            this.currentUser = window.firebaseAuth.currentUser;
            this.updateNavigationState();
        }
    }
    
    updateNavigationState() {
        if (!this.authNavLink || !this.authNavText) return;
        
        if (this.currentUser) {
            // User is logged in - show as Profile button
            this.authNavText.textContent = 'Profil';
            this.authNavLink.classList.remove('login-link');
            this.authNavLink.classList.add('profile-link');
            this.authNavLink.href = 'profile.html';
            
            // Add user avatar if available
            this.addUserAvatar();
        } else {
            // User is not logged in - show as Login button
            this.authNavText.textContent = 'Login';
            this.authNavLink.classList.remove('profile-link');
            this.authNavLink.classList.add('login-link');
            this.authNavLink.href = 'login.html';
            
            // Remove user avatar
            this.removeUserAvatar();
        }
    }
    
    addUserAvatar() {
        // Remove existing avatar if any
        this.removeUserAvatar();
        
        if (this.currentUser && this.currentUser.photoURL) {
            const avatar = document.createElement('img');
            avatar.src = this.currentUser.photoURL;
            avatar.alt = 'Profil Avatar';
            avatar.className = 'nav-avatar';
            avatar.style.cssText = `
                width: 24px;
                height: 24px;
                border-radius: 50%;
                margin-right: 0.5rem;
                border: 2px solid #B87333;
            `;
            
            this.authNavLink.insertBefore(avatar, this.authNavText);
        }
    }
    
    removeUserAvatar() {
        const existingAvatar = this.authNavLink.querySelector('.nav-avatar');
        if (existingAvatar) {
            existingAvatar.remove();
        }
    }
    
    handleAuthNavClick() {
        if (this.currentUser) {
            // User is logged in, go to profile
            window.location.href = 'profile.html';
        } else {
            // User is not logged in, go to login
            window.location.href = 'login.html';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DynamicNavigation();
});

// Also initialize if firebase is already loaded
if (window.firebaseAuth) {
    new DynamicNavigation();
}

export default DynamicNavigation;
