import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    doc,
    setDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class AuthManager {
    constructor() {
        this.isSignupMode = false;
        this.auth = null;
        this.db = null;
        this.init();
    }

    init() {
        // Wait for Firebase to be initialized
        if (window.firebaseAuth && window.firebaseDb) {
            this.auth = window.firebaseAuth;
            this.db = window.firebaseDb;
            this.bindEvents();
            this.checkAuthState();
        } else {
            // Wait for Firebase to load
            setTimeout(() => this.init(), 100);
        }
    }

    bindEvents() {
        const authForm = document.getElementById('auth-form');
        const authToggle = document.getElementById('auth-toggle');
        const forgotPasswordBtn = document.getElementById('forgot-password');

        if (authForm) {
            authForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        if (authToggle) {
            authToggle.addEventListener('click', () => this.toggleAuthMode());
        }

        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', () => this.handleForgotPassword());
        }
    }

    toggleAuthMode() {
        this.isSignupMode = !this.isSignupMode;
        
        const title = document.getElementById('auth-title');
        const subtitle = document.getElementById('auth-subtitle');
        const submitBtn = document.getElementById('auth-submit');
        const toggleBtn = document.getElementById('auth-toggle');
        const switchText = document.getElementById('switch-text');
        const signupFields = document.getElementById('signup-fields');
        const forgotPasswordBtn = document.getElementById('forgot-password');

        if (this.isSignupMode) {
            title.textContent = 'Tritt der mystischen Gemeinschaft bei';
            subtitle.textContent = 'Erstelle dein Konto für exklusive Produkte';
            submitBtn.textContent = 'Registrieren';
            toggleBtn.textContent = 'Anmelden';
            switchText.textContent = 'Bereits Mitglied?';
            signupFields.style.display = 'block';
            forgotPasswordBtn.style.display = 'none';
        } else {
            title.textContent = 'Willkommen zurück';
            subtitle.textContent = 'Melde dich in deinem mystischen Portal an';
            submitBtn.textContent = 'Anmelden';
            toggleBtn.textContent = 'Registrieren';
            switchText.textContent = 'Noch kein Konto?';
            signupFields.style.display = 'none';
            forgotPasswordBtn.style.display = 'block';
        }

        this.clearMessages();
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        this.clearMessages();
        this.setLoading(true);

        try {
            if (this.isSignupMode) {
                await this.handleSignup(email, password);
            } else {
                await this.handleLogin(email, password);
            }
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        } finally {
            this.setLoading(false);
        }
    }

    async handleSignup(email, password) {
        const displayName = document.getElementById('displayName').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const zodiacSign = document.getElementById('zodiacSign').value;

        // Validation
        if (password !== confirmPassword) {
            throw new Error('auth/passwords-dont-match');
        }

        if (password.length < 6) {
            throw new Error('auth/weak-password');
        }

        // Create user
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;

        // Update profile
        await updateProfile(user, {
            displayName: displayName || 'Mystiker'
        });

        // Create user document in Firestore
        await setDoc(doc(this.db, 'users', user.uid), {
            email: email,
            displayName: displayName || 'Mystiker',
            zodiacSign: zodiacSign,
            createdAt: serverTimestamp(),
            level: 'Novize',
            energyPoints: 100,
            totalOrders: 0,
            preferences: {
                dailyHoroscope: true,
                newProducts: true,
                moonPhases: false,
                favoriteCrystals: ['Amethyst', 'Rosenquarz', 'Bergkristall'],
                interests: ['Astrologie', 'Meditation', 'Tarot']
            }
        });

        this.showSuccess('Willkommen in der mystischen Gemeinschaft! Du wirst weitergeleitet...');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }

    async handleLogin(email, password) {
        await signInWithEmailAndPassword(this.auth, email, password);
        
        this.showSuccess('Erfolgreich angemeldet! Du wirst weitergeleitet...');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }

    async handleForgotPassword() {
        const email = document.getElementById('email').value;
        
        if (!email) {
            this.showError('Bitte gib deine E-Mail Adresse ein');
            return;
        }

        try {
            await sendPasswordResetEmail(this.auth, email);
            this.showSuccess('Passwort-Reset E-Mail wurde gesendet!');
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        }
    }

    checkAuthState() {
        onAuthStateChanged(this.auth, (user) => {
            if (user && window.location.pathname.includes('login.html')) {
                window.location.href = 'profile.html';
            }
        });
    }

    setLoading(isLoading) {
        const submitBtn = document.getElementById('auth-submit');
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.textContent = isLoading ? 'Lädt...' : (this.isSignupMode ? 'Registrieren' : 'Anmelden');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('auth-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    showSuccess(message) {
        const successDiv = document.getElementById('auth-success');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }

    clearMessages() {
        const errorDiv = document.getElementById('auth-error');
        const successDiv = document.getElementById('auth-success');
        
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }
        
        if (successDiv) {
            successDiv.style.display = 'none';
            successDiv.textContent = '';
        }
    }

    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'Kein Benutzer mit dieser E-Mail gefunden',
            'auth/wrong-password': 'Falsches Passwort',
            'auth/email-already-in-use': 'Diese E-Mail wird bereits verwendet',
            'auth/weak-password': 'Das Passwort muss mindestens 6 Zeichen lang sein',
            'auth/invalid-email': 'Ungültige E-Mail Adresse',
            'auth/passwords-dont-match': 'Passwörter stimmen nicht überein',
            'auth/network-request-failed': 'Netzwerkfehler. Bitte versuche es erneut.',
            'auth/too-many-requests': 'Zu viele Anfragen. Bitte warte einen Moment.'
        };

        return errorMessages[errorCode] || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
