import {
    auth,
    db,
    googleProvider
} from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class AuthManager {
    constructor() {
        this.handleAuthentication();
    }

    handleAuthentication() {
        onAuthStateChanged(auth, user => {
            if (user) {
                this.updateUIAfterLogin(user);
                if (window.location.pathname.endsWith('profile.html')) {
                    this.loadUserProfile(user);
                }
            } else {
                this.updateUIAfterLogout();
            }
        });

        const pathname = window.location.pathname;
        if (pathname.endsWith('register.html')) {
            this.attachRegisterListener();
        }
        if (pathname.endsWith('login.html')) {
            this.attachLoginListener();
            this.attachGoogleLoginListener();
        }
        // The logout button can be on any page, so we always try to attach it.
        this.attachLogoutListener();
    }

    attachRegisterListener() {
        const form = document.getElementById('register-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorDiv = document.getElementById('auth-error');
            errorDiv.textContent = '';

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (!data.agb) {
                errorDiv.textContent = 'Sie müssen den AGB zustimmen.';
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    address: data.address,
                    zip: data.zip,
                    city: data.city,
                    createdAt: serverTimestamp()
                });

                window.location.href = 'profile.html';

            } catch (error) {
                console.error("Registration Error:", error);
                errorDiv.textContent = this.getFriendlyAuthError(error);
            }
        });
    }

    attachLoginListener() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorDiv = document.getElementById('auth-error');
            errorDiv.textContent = '';

            const email = form.email.value;
            const password = form.password.value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = 'profile.html';
            } catch (error) {
                console.error("Login Error:", error);
                errorDiv.textContent = this.getFriendlyAuthError(error);
            }
        });
    }

    attachGoogleLoginListener() {
        const googleBtn = document.getElementById('google-login-btn');
        if (!googleBtn) return;

        googleBtn.addEventListener('click', async () => {
            const errorDiv = document.getElementById('auth-error');
            if(errorDiv) errorDiv.textContent = '';
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;

                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists()) {
                    const [firstname, ...lastname] = user.displayName.split(' ');
                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        firstname: firstname || '',
                        lastname: lastname.join(' ') || '',
                        email: user.email,
                        createdAt: serverTimestamp()
                    });
                }
                window.location.href = 'profile.html';
            } catch (error) {
                console.error("Google Sign-In Error:", error);
                if(errorDiv) errorDiv.textContent = this.getFriendlyAuthError(error);
            }
        });
    }

    attachLogoutListener() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await signOut(auth);
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("Logout Error:", error);
                }
            });
        }
    }

    async loadUserProfile(user) {
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        const addressEl = document.getElementById('profile-address');
        
        if (!nameEl || !emailEl || !addressEl) return;

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                nameEl.textContent = `${data.firstname} ${data.lastname}`;
                emailEl.textContent = data.email;
                
                const addressParts = [data.address, data.zip, data.city].filter(Boolean);
                addressEl.textContent = addressParts.join(', ') || 'Keine Adresse hinterlegt.';

            } else {
                nameEl.textContent = user.displayName || 'Willkommen';
                emailEl.textContent = user.email;
                addressEl.textContent = 'Bitte vervollständigen Sie Ihr Profil.';
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
            nameEl.textContent = 'Fehler beim Laden des Profils.';
        }
    }

    updateUIAfterLogin(user) {
        const authNavLink = document.getElementById('auth-nav-link');
        const authNavText = document.getElementById('auth-nav-text');
        if (authNavLink && authNavText) {
            authNavLink.href = 'profile.html';
            authNavText.textContent = 'Profil';
        }
    }

    updateUIAfterLogout() {
        const authNavLink = document.getElementById('auth-nav-link');
        const authNavText = document.getElementById('auth-nav-text');
        if (authNavLink && authNavText) {
            authNavLink.href = 'login.html';
            authNavText.textContent = 'Login';
        }
    }
    
    getFriendlyAuthError(error) {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'Ungültige E-Mail-Adresse.';
            case 'auth/user-disabled':
                return 'Dieses Konto wurde deaktiviert.';
            case 'auth/user-not-found':
                return 'Kein Konto mit dieser E-Mail-Adresse gefunden.';
            case 'auth/wrong-password':
                return 'Falsches Passwort. Bitte versuchen Sie es erneut.';
            case 'auth/email-already-in-use':
                return 'Diese E-Mail-Adresse wird bereits verwendet.';
            case 'auth/weak-password':
                return 'Das Passwort ist zu schwach. Es muss mindestens 6 Zeichen lang sein.';
            case 'auth/popup-closed-by-user':
                return 'Anmeldung abgebrochen.';
            default:
                return 'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
