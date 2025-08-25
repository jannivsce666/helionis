import {
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.auth = null;
        this.db = null;
        this.zodiacSprites = {
            aries: { name: 'Widder', element: 'Feuer', dates: '21.03 - 19.04' },
            taurus: { name: 'Stier', element: 'Erde', dates: '20.04 - 20.05' },
            gemini: { name: 'Zwillinge', element: 'Luft', dates: '21.05 - 20.06' },
            cancer: { name: 'Krebs', element: 'Wasser', dates: '21.06 - 22.07' },
            leo: { name: 'Löwe', element: 'Feuer', dates: '23.07 - 22.08' },
            virgo: { name: 'Jungfrau', element: 'Erde', dates: '23.08 - 22.09' },
            libra: { name: 'Waage', element: 'Luft', dates: '23.09 - 22.10' },
            scorpio: { name: 'Skorpion', element: 'Wasser', dates: '23.10 - 21.11' },
            sagittarius: { name: 'Schütze', element: 'Feuer', dates: '22.11 - 21.12' },
            capricorn: { name: 'Steinbock', element: 'Erde', dates: '22.12 - 19.01' },
            aquarius: { name: 'Wassermann', element: 'Luft', dates: '20.01 - 18.02' },
            pisces: { name: 'Fische', element: 'Wasser', dates: '19.02 - 20.03' }
        };
        this.init();
    }

    init() {
        // Wait for Firebase to be initialized
        if (window.firebaseAuth && window.firebaseDb) {
            this.auth = window.firebaseAuth;
            this.db = window.firebaseDb;
            this.checkAuthState();
            this.bindEvents();
        } else {
            // Wait for Firebase to load
            setTimeout(() => this.init(), 100);
        }
    }

    checkAuthState() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.currentUser = user;
                this.loadUserProfile();
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    bindEvents() {
        const logoutBtn = document.getElementById('logout-btn');
        const profileForm = document.getElementById('profile-form');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Notification settings
        document.querySelectorAll('.notification-settings input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateNotificationSettings());
        });

        // Add tag functionality
        document.querySelectorAll('.add-tag').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAddTag(e));
        });
    }

    async loadUserProfile() {
        try {
            const userDoc = await getDoc(doc(this.db, 'users', this.currentUser.uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                this.populateProfile(userData);
                this.loadZodiacSprite(userData.zodiacSign);
            } else {
                // Create default user document if it doesn't exist
                await this.createDefaultUserDoc();
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    populateProfile(userData) {
        // Basic info
        document.getElementById('profile-name').textContent = userData.displayName || 'Mystiker';
        document.getElementById('profile-email').textContent = this.currentUser.email;
        
        // Member since
        if (userData.createdAt) {
            const memberSince = new Date(userData.createdAt.seconds * 1000);
            document.getElementById('profile-member-since').textContent = 
                `Mitglied seit ${memberSince.toLocaleDateString('de-DE')}`;
        }

        // Stats
        document.getElementById('total-orders').textContent = userData.totalOrders || 0;
        document.getElementById('profile-level').textContent = userData.level || 'Novize';
        document.getElementById('energy-points').textContent = userData.energyPoints || 0;

        // Form fields
        document.getElementById('edit-displayName').value = userData.displayName || '';
        document.getElementById('edit-email').value = this.currentUser.email;
        document.getElementById('edit-zodiacSign').value = userData.zodiacSign || '';
        document.getElementById('edit-birthDate').value = userData.birthDate || '';
        document.getElementById('edit-bio').value = userData.bio || '';

        // Notification preferences
        if (userData.preferences) {
            document.getElementById('daily-horoscope').checked = userData.preferences.dailyHoroscope !== false;
            document.getElementById('new-products').checked = userData.preferences.newProducts !== false;
            document.getElementById('moon-phases').checked = userData.preferences.moonPhases === true;

            // Update preference tags
            this.updatePreferenceTags('favorite-crystals', userData.preferences.favoriteCrystals || []);
            this.updatePreferenceTags('interests', userData.preferences.interests || []);
        }
    }

    loadZodiacSprite(zodiacSign) {
        if (!zodiacSign) return;

        const avatarSvg = document.getElementById('zodiac-avatar');
        const sprite = this.createZodiacSprite(zodiacSign);
        
        if (avatarSvg && sprite) {
            avatarSvg.innerHTML = sprite;
        }
    }

    createZodiacSprite(sign) {
        const sprites = {
            aries: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8">
                        <animate attributeName="stroke-width" values="2;4;2" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <path d="M30 60 Q40 30 50 50 Q60 30 70 60" stroke="#B87333" stroke-width="3" fill="none">
                        <animate attributeName="stroke" values="#B87333;#D4AF37;#B87333" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <circle cx="40" cy="40" r="3" fill="#EDE9E4"/>
                    <circle cx="60" cy="40" r="3" fill="#EDE9E4"/>
                </g>
            `,
            taurus: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <circle cx="50" cy="55" r="15" fill="none" stroke="#B87333" stroke-width="2"/>
                    <path d="M35 40 Q45 30 50 40 Q55 30 65 40" stroke="#B87333" stroke-width="3" fill="none">
                        <animateTransform attributeName="transform" type="rotate" values="0 50 50;5 50 50;-5 50 50;0 50 50" dur="4s" repeatCount="indefinite"/>
                    </path>
                </g>
            `,
            gemini: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <line x1="35" y1="30" x2="35" y2="70" stroke="#B87333" stroke-width="3">
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <line x1="65" y1="30" x2="65" y2="70" stroke="#B87333" stroke-width="3">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <line x1="30" y1="40" x2="70" y2="40" stroke="#B87333" stroke-width="2"/>
                    <line x1="30" y1="60" x2="70" y2="60" stroke="#B87333" stroke-width="2"/>
                </g>
            `,
            cancer: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <path d="M30 50 Q40 30 50 50 Q60 70 70 50" stroke="#B87333" stroke-width="3" fill="none">
                        <animate attributeName="d" values="M30 50 Q40 30 50 50 Q60 70 70 50;M30 50 Q40 35 50 50 Q60 65 70 50;M30 50 Q40 30 50 50 Q60 70 70 50" dur="3s" repeatCount="indefinite"/>
                    </path>
                    <circle cx="35" cy="45" r="2" fill="#EDE9E4"/>
                    <circle cx="65" cy="55" r="2" fill="#EDE9E4"/>
                </g>
            `,
            leo: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8">
                        <animate attributeName="r" values="35;40;35" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="50" cy="45" r="12" fill="none" stroke="#B87333" stroke-width="2"/>
                    <path d="M50 57 Q35 70 45 75 Q50 80 55 75 Q65 70 50 57" stroke="#B87333" stroke-width="3" fill="#B87333" opacity="0.3">
                        <animateTransform attributeName="transform" type="rotate" values="0 50 50;10 50 50;-10 50 50;0 50 50" dur="3s" repeatCount="indefinite"/>
                    </path>
                </g>
            `,
            virgo: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <path d="M30 35 L30 65 M40 35 L40 55 Q45 65 55 55 L55 35 M65 35 L65 50 Q70 60 75 50" stroke="#B87333" stroke-width="2" fill="none">
                        <animate attributeName="stroke-opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite"/>
                    </path>
                </g>
            `,
            libra: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <line x1="30" y1="60" x2="70" y2="60" stroke="#B87333" stroke-width="3">
                        <animate attributeName="y1" values="60;58;60" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="y2" values="60;58;60" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <circle cx="50" cy="45" r="10" fill="none" stroke="#B87333" stroke-width="2">
                        <animate attributeName="r" values="10;12;10" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <line x1="50" y1="35" x2="50" y2="25" stroke="#B87333" stroke-width="2"/>
                </g>
            `,
            scorpio: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <path d="M30 35 L30 65 M40 35 L40 55 Q45 65 55 55 L55 35 M65 35 L65 55 Q70 65 75 55 L75 45" stroke="#B87333" stroke-width="2" fill="none"/>
                    <path d="M70 50 L75 45 L80 50" stroke="#B87333" stroke-width="2" fill="none">
                        <animateTransform attributeName="transform" type="rotate" values="0 75 50;15 75 50;-15 75 50;0 75 50" dur="2s" repeatCount="indefinite"/>
                    </path>
                </g>
            `,
            sagittarius: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <line x1="30" y1="70" x2="70" y2="30" stroke="#B87333" stroke-width="3">
                        <animate attributeName="stroke-width" values="3;5;3" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <path d="M65 25 L75 30 L70 40" stroke="#B87333" stroke-width="2" fill="none">
                        <animateTransform attributeName="transform" type="rotate" values="0 70 30;10 70 30;-10 70 30;0 70 30" dur="3s" repeatCount="indefinite"/>
                    </path>
                </g>
            `,
            capricorn: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <path d="M30 60 Q35 30 45 50 Q50 70 65 40 Q70 60 75 55" stroke="#B87333" stroke-width="3" fill="none">
                        <animate attributeName="stroke-dasharray" values="0,100;50,50;0,100" dur="4s" repeatCount="indefinite"/>
                    </path>
                </g>
            `,
            aquarius: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <path d="M25 45 Q35 35 45 45 Q55 55 65 45 Q75 35 85 45" stroke="#B87333" stroke-width="2" fill="none">
                        <animate attributeName="d" values="M25 45 Q35 35 45 45 Q55 55 65 45 Q75 35 85 45;M25 45 Q35 40 45 45 Q55 50 65 45 Q75 40 85 45;M25 45 Q35 35 45 45 Q55 55 65 45 Q75 35 85 45" dur="3s" repeatCount="indefinite"/>
                    </path>
                    <path d="M25 55 Q35 45 45 55 Q55 65 65 55 Q75 45 85 55" stroke="#B87333" stroke-width="2" fill="none">
                        <animate attributeName="d" values="M25 55 Q35 45 45 55 Q55 65 65 55 Q75 45 85 55;M25 55 Q35 50 45 55 Q55 60 65 55 Q75 50 85 55;M25 55 Q35 45 45 55 Q55 65 65 55 Q75 45 85 55" dur="3s" repeatCount="indefinite" begin="1.5s"/>
                    </path>
                </g>
            `,
            pisces: `
                <g class="zodiac-sprite">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#B87333" stroke-width="2" opacity="0.8"/>
                    <path d="M25 50 Q35 30 35 50 Q35 70 25 50" stroke="#B87333" stroke-width="2" fill="none">
                        <animate attributeName="d" values="M25 50 Q35 30 35 50 Q35 70 25 50;M25 50 Q38 30 35 50 Q32 70 25 50;M25 50 Q35 30 35 50 Q35 70 25 50" dur="4s" repeatCount="indefinite"/>
                    </path>
                    <path d="M75 50 Q65 30 65 50 Q65 70 75 50" stroke="#B87333" stroke-width="2" fill="none">
                        <animate attributeName="d" values="M75 50 Q65 30 65 50 Q65 70 75 50;M75 50 Q62 30 65 50 Q68 70 75 50;M75 50 Q65 30 65 50 Q65 70 75 50" dur="4s" repeatCount="indefinite" begin="2s"/>
                    </path>
                    <line x1="35" y1="50" x2="65" y2="50" stroke="#B87333" stroke-width="1"/>
                </g>
            `
        };

        return sprites[sign] || sprites.aries;
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updateData = {
            displayName: formData.get('displayName'),
            zodiacSign: formData.get('zodiacSign'),
            birthDate: formData.get('birthDate'),
            bio: formData.get('bio'),
            updatedAt: serverTimestamp()
        };

        try {
            // Update Firebase Auth profile
            await updateProfile(this.currentUser, {
                displayName: updateData.displayName
            });

            // Update Firestore document
            await updateDoc(doc(this.db, 'users', this.currentUser.uid), updateData);

            // Update zodiac sprite if changed
            if (updateData.zodiacSign) {
                this.loadZodiacSprite(updateData.zodiacSign);
            }

            this.showSuccess('Profil erfolgreich aktualisiert!');
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showError('Fehler beim Aktualisieren des Profils');
        }
    }

    async updateNotificationSettings() {
        const preferences = {
            dailyHoroscope: document.getElementById('daily-horoscope').checked,
            newProducts: document.getElementById('new-products').checked,
            moonPhases: document.getElementById('moon-phases').checked
        };

        try {
            await updateDoc(doc(this.db, 'users', this.currentUser.uid), {
                'preferences.dailyHoroscope': preferences.dailyHoroscope,
                'preferences.newProducts': preferences.newProducts,
                'preferences.moonPhases': preferences.moonPhases,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating notification settings:', error);
        }
    }

    updatePreferenceTags(containerId, tags) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const addButton = container.querySelector('.add-tag');
        
        // Clear existing tags except add button
        container.querySelectorAll('.tag').forEach(tag => tag.remove());
        
        // Add tags
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-tag';
            removeBtn.addEventListener('click', () => this.removeTag(containerId, tag));
            
            tagElement.appendChild(removeBtn);
            container.insertBefore(tagElement, addButton);
        });
    }

    handleAddTag(e) {
        const container = e.target.parentElement;
        const containerId = container.id;
        
        const newTag = prompt('Neuen Tag hinzufügen:');
        if (newTag && newTag.trim()) {
            this.addTag(containerId, newTag.trim());
        }
    }

    async addTag(containerId, tag) {
        try {
            const userDoc = await getDoc(doc(this.db, 'users', this.currentUser.uid));
            const userData = userDoc.data();
            
            const fieldMap = {
                'favorite-crystals': 'preferences.favoriteCrystals',
                'interests': 'preferences.interests'
            };
            
            const field = fieldMap[containerId];
            if (!field) return;
            
            const currentTags = userData.preferences?.[field.split('.')[1]] || [];
            if (!currentTags.includes(tag)) {
                currentTags.push(tag);
                
                await updateDoc(doc(this.db, 'users', this.currentUser.uid), {
                    [field]: currentTags,
                    updatedAt: serverTimestamp()
                });
                
                this.updatePreferenceTags(containerId, currentTags);
            }
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    }

    async removeTag(containerId, tag) {
        try {
            const userDoc = await getDoc(doc(this.db, 'users', this.currentUser.uid));
            const userData = userDoc.data();
            
            const fieldMap = {
                'favorite-crystals': 'preferences.favoriteCrystals',
                'interests': 'preferences.interests'
            };
            
            const field = fieldMap[containerId];
            if (!field) return;
            
            const currentTags = userData.preferences?.[field.split('.')[1]] || [];
            const updatedTags = currentTags.filter(t => t !== tag);
            
            await updateDoc(doc(this.db, 'users', this.currentUser.uid), {
                [field]: updatedTags,
                updatedAt: serverTimestamp()
            });
            
            this.updatePreferenceTags(containerId, updatedTags);
        } catch (error) {
            console.error('Error removing tag:', error);
        }
    }

    async createDefaultUserDoc() {
        await setDoc(doc(this.db, 'users', this.currentUser.uid), {
            email: this.currentUser.email,
            displayName: this.currentUser.displayName || 'Mystiker',
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
        
        this.loadUserProfile();
    }

    async handleLogout() {
        try {
            await signOut(this.auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    showSuccess(message) {
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    showError(message) {
        // Create a temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});
