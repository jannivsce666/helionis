// Profile Page Authentication Guard
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

function waitForAuth() {
    return new Promise((resolve) => {
        if (window.firebaseAuth && window.firebaseReady) {
            resolve(window.firebaseAuth);
        } else {
            const checkAuth = () => {
                if (window.firebaseAuth && window.firebaseReady) {
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
        
        // Wait for auth state to be determined with timeout
        return new Promise((resolve) => {
            let resolved = false;
            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(null); // Timeout, assume not authenticated
                }
            }, 3000); // 3 second timeout
            
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    unsubscribe();
                    resolve(user);
                }
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
        // Wait a bit for everything to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = await checkAuthStatus();
        
        if (!user) {
            // Not authenticated, redirect to login
            console.log('User not authenticated, redirecting to login');
            window.location.replace('login.html');
        } else {
            console.log('User authenticated:', user.email);
            // User is authenticated, page can load normally
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        // On error, redirect to login for safety
        window.location.replace('login.html');
    }
});
