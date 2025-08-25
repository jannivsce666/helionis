// Profile Page Authentication Guard
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

function waitForAuth() {
    return new Promise((resolve) => {
        if (window.firebaseAuth) {
            resolve(window.firebaseAuth);
        } else {
            const checkAuth = () => {
                if (window.firebaseAuth) {
                    resolve(window.firebaseAuth);
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        }
    });
}

async function checkAuthStatus() {
    try {
        const auth = await waitForAuth();
        
        // Wait for auth state to be determined
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe(); // Only check once
                resolve(user);
            });
        });
    } catch (error) {
        console.error('Auth check failed:', error);
        return null;
    }
}

// Protect profile page
document.addEventListener('DOMContentLoaded', async () => {
    // Only run on profile page
    if (!window.location.pathname.endsWith('profile.html')) {
        return;
    }

    try {
        const user = await checkAuthStatus();
        
        if (!user) {
            // Not authenticated, redirect to login
            console.log('User not authenticated, redirecting to login');
            window.location.href = 'login.html';
        } else {
            console.log('User authenticated:', user.email);
            // User is authenticated, page can load normally
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        // On error, redirect to login for safety
        window.location.href = 'login.html';
    }
});
