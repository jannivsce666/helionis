// Login.js - Login page specific functionality
import './google-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async function() {
            try {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Trigger Google sign in from google-auth.js
                const signInEvent = new CustomEvent('googleSignIn');
                document.dispatchEvent(signInEvent);
                
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Anmeldung fehlgeschlagen: ' + error.message, 'error');
            }
        });
    }
    
    // Listen for auth state changes
    document.addEventListener('authStateChanged', function(event) {
        if (event.detail.user) {
            // User is signed in, redirect to profile or previous page
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect') || 'profile.html';
            window.location.href = redirectUrl;
        }
    });
});

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : '#B87333'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
