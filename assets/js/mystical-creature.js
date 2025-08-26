// Mystical Creature Animation for Horoscope Page
class MysticalCreature {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.creature = {
            x: 0,
            y: 0,
            size: 140, // Größer für mehr Details
            rotation: 0,
            floatOffset: 0,
            eyeBlinkTimer: 0,
            isBlinking: false,
            haloRotation: 0
        };
        this.stars = [];
        this.horoscope = {
            date: null,
            signs: [],
            cycleIndex: 0,
            timer: null
        };
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupCreature();
        this.createStars();
        this.animate();
        this.setupInteraction();
        this.setupMessageElement();
        this.fetchHoroscopeData(); // Neu: Daily Horoscope laden
    }

    setupMessageElement() {
        // Find the mystical text element
        this.messageEl = document.getElementById('mysticalText');
        if (!this.messageEl) {
            console.warn('Mystical text element not found');
        }
    }

    createCanvas() {
        // Find existing canvas element
        this.canvas = document.getElementById('mysticalCreatureCanvas');
        if (!this.canvas) {
            console.error('Mystical creature canvas not found!');
            this.showFallbackOrb();
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get 2D context!');
            this.showFallbackOrb();
            return;
        }
        
        // Set canvas dimensions
        this.canvas.width = 300;
        this.canvas.height = 300;
        
        // Add visible border for debugging
        this.canvas.style.border = '2px solid rgba(184, 115, 51, 0.3)';
        this.canvas.style.borderRadius = '15px';
        this.canvas.style.background = 'rgba(13, 13, 13, 0.5)';
        
        // Check for mobile device
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window;
        
        // Adjust animation speed for mobile
        this.animationSpeed = this.isMobile ? 0.7 : 1.0;
        
        console.log('Canvas initialized successfully', this.canvas.width, 'x', this.canvas.height);
    }
    
    showFallbackOrb() {
        // Create a visible CSS-based orb as fallback
        const container = document.getElementById('creatureContainer');
        if (container) {
            container.innerHTML = `
                <div class="fallback-orb">
                    <div class="orb-core"></div>
                    <div class="orb-glow"></div>
                    <div class="orb-sparkles">
                        <span></span><span></span><span></span><span></span>
                    </div>
                </div>
                <div class="creature-text">
                    <p id="mysticalText">🔮 Das Kristall-Orakel erwacht...</p>
                </div>
                <style>
                .fallback-orb {
                    position: relative;
                    width: 200px;
                    height: 200px;
                    margin: 2rem auto;
                }
                .orb-core {
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at 30% 30%, #FFD700, #B87333, #8B4513);
                    border-radius: 50%;
                    animation: orbPulse 3s ease-in-out infinite;
                    box-shadow: 0 0 40px rgba(184, 115, 51, 0.6), inset 0 0 40px rgba(255, 215, 0, 0.3);
                }
                .orb-glow {
                    position: absolute;
                    top: -20px; left: -20px; right: -20px; bottom: -20px;
                    background: radial-gradient(circle, rgba(184, 115, 51, 0.3), transparent 70%);
                    border-radius: 50%;
                    animation: orbGlow 4s ease-in-out infinite alternate;
                }
                .orb-sparkles span {
                    position: absolute;
                    width: 4px; height: 4px;
                    background: #FFD700;
                    border-radius: 50%;
                    animation: sparkle 2s linear infinite;
                }
                .orb-sparkles span:nth-child(1) { top: 20%; left: 80%; animation-delay: 0s; }
                .orb-sparkles span:nth-child(2) { top: 80%; left: 20%; animation-delay: 0.5s; }
                .orb-sparkles span:nth-child(3) { top: 20%; left: 20%; animation-delay: 1s; }
                .orb-sparkles span:nth-child(4) { top: 80%; left: 80%; animation-delay: 1.5s; }
                @keyframes orbPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes orbGlow {
                    0% { opacity: 0.6; }
                    100% { opacity: 1; }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1); }
                }
                </style>
            `;
        }
    }

    setupCreature() {
        this.creature.x = this.canvas.width / 2;
        this.creature.y = this.canvas.height / 2 + 20;
    }

    createStars() {
        // Create floating stars around the creature
        for (let i = 0; i < 8; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                twinkle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01
            });
        }
    }

    drawStars() {
        this.ctx.save();
        this.stars.forEach(star => {
            const alpha = (Math.sin(star.twinkle) + 1) / 2;
            this.ctx.globalAlpha = alpha * 0.6;
            
            // Modern star particles - more geometric
            const starGradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
            starGradient.addColorStop(0, '#FFD700');
            starGradient.addColorStop(0.5, '#B87333');
            starGradient.addColorStop(1, 'rgba(184, 115, 51, 0)');
            
            this.ctx.fillStyle = starGradient;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Bright center
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            star.twinkle += star.speed;
            
            // Gentle floating motion
            star.y += Math.sin(star.twinkle) * 0.3;
            star.x += Math.cos(star.twinkle * 0.7) * 0.2;
            
            // Wrap around edges
            if (star.x > this.canvas.width) star.x = 0;
            if (star.x < 0) star.x = this.canvas.width;
            if (star.y > this.canvas.height) star.y = 0;
            if (star.y < 0) star.y = this.canvas.height;
        });
        this.ctx.restore();
    }

    drawStar(x, y, innerRadius, outerRadius, points) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        
        const angleStep = (Math.PI * 2) / (points * 2);
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = i * angleStep - Math.PI / 2;
            const pointX = Math.cos(angle) * radius;
            const pointY = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(pointX, pointY);
            } else {
                this.ctx.lineTo(pointX, pointY);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawCreature() {
        const { x, y, size, rotation, floatOffset, isBlinking, haloRotation } = this.creature;
        
        this.ctx.save();
        this.ctx.translate(x, y + Math.sin(floatOffset) * 5);

        // Draw floating crystal orb companion
        this.drawCrystalOrb(size, haloRotation);

        // Draw energy wisps around it
        this.drawEnergyWisps(size, floatOffset);

        // Draw mystical runes
        this.drawFloatingRunes(size, rotation);

        this.ctx.restore();
    }

    drawCrystalOrb(size, rotation) {
        // Main crystal orb - modern geometric design
        this.ctx.save();
        this.ctx.rotate(rotation * 0.5);
        
        // Outer crystal shell with gradient
        const outerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        outerGradient.addColorStop(0, 'rgba(184, 115, 51, 0.1)');
        outerGradient.addColorStop(0.7, 'rgba(184, 115, 51, 0.3)');
        outerGradient.addColorStop(1, 'rgba(184, 115, 51, 0.6)');
        
        this.ctx.fillStyle = outerGradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner crystal core - bright and mystical
        const innerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size/3);
        innerGradient.addColorStop(0, '#FFD700');
        innerGradient.addColorStop(0.5, '#B87333');
        innerGradient.addColorStop(1, '#8B4513');
        
        this.ctx.fillStyle = innerGradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size/3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Crystal facets - geometric pattern
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        
        // Draw crystal facet lines
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = Math.cos(angle) * (size/4);
            const y1 = Math.sin(angle) * (size/4);
            const x2 = Math.cos(angle) * (size/2.5);
            const y2 = Math.sin(angle) * (size/2.5);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
        
        // Central mystical symbol - modern sacred geometry
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size/6, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner triangle
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 - Math.PI/2;
            const x = Math.cos(angle) * (size/8);
            const y = Math.sin(angle) * (size/8);
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawEnergyWisps(size, floatOffset) {
        // Floating energy wisps around the orb
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + floatOffset;
            const distance = size/1.5 + Math.sin(floatOffset * 2 + i) * 15;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            // Wisp glow
            const wispGradient = this.ctx.createRadialGradient(x, y, 0, x, y, 8);
            wispGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            wispGradient.addColorStop(0.5, 'rgba(184, 115, 51, 0.5)');
            wispGradient.addColorStop(1, 'rgba(184, 115, 51, 0)');
            
            this.ctx.fillStyle = wispGradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Wisp core
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Wisp tail
            this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            const tailX = x - Math.cos(angle) * 12;
            const tailY = y - Math.sin(angle) * 12;
            this.ctx.lineTo(tailX, tailY);
            this.ctx.stroke();
        }
    }

    drawFloatingRunes(size, rotation) {
        // Mystical runes floating around the orb
        const runes = ['◊', '◇', '◈', '◉'];
        
        for (let i = 0; i < 4; i++) {
            this.ctx.save();
            
            const angle = (i / 4) * Math.PI * 2 + rotation;
            const distance = size/1.2;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation * (i % 2 === 0 ? 1 : -1));
            
            // Rune glow
            this.ctx.shadowColor = '#B87333';
            this.ctx.shadowBlur = 10;
            
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(runes[i], 0, 0);
            
            this.ctx.shadowBlur = 0;
            this.ctx.restore();
        }
    }

    animate() {
        if (!this.canvas || !this.ctx) {
            console.warn('Canvas not available for animation');
            return;
        }
        
        try {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Detect mobile devices and slow down animations
            const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
            const speedMultiplier = isMobile ? 0.3 : 1; // 70% slower on mobile
            
            // Update creature animations with mobile-aware speed
            this.creature.floatOffset += 0.02 * speedMultiplier;
            this.creature.rotation += 0.008 * speedMultiplier;
            this.creature.haloRotation += 0.015 * speedMultiplier;
            
            // Draw everything
            this.drawStars();
            this.drawCreature();
            
            requestAnimationFrame(() => this.animate());
        } catch (error) {
            console.error('Animation error:', error);
            // Try to show fallback if animation fails
            this.showFallbackOrb();
        }
    }

    setupInteraction() {
        this.canvas.addEventListener('mouseenter', () => {
            this.canvas.style.transform = 'scale(1.1)';
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.canvas.style.transform = 'scale(1)';
        });
        
        this.canvas.addEventListener('click', () => {
            // Add some sparkle effect on click
            this.createClickSparkles();
        });
    }

    createClickSparkles() {
        // Add magical energy burst on click
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.stars.push({
                    x: this.creature.x + (Math.random() - 0.5) * 80,
                    y: this.creature.y + (Math.random() - 0.5) * 80,
                    size: Math.random() * 3 + 1,
                    twinkle: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.08 + 0.03
                });
            }, i * 80);
        }
        
        // Remove extra stars after animation
        setTimeout(() => {
            this.stars = this.stars.slice(0, 8);
        }, 3000);
    }

    fetchHoroscopeData() {
        // JSON wird von GitHub Action täglich generiert: assets/data/horoscope.json
        const url = `assets/data/horoscope.json?ts=${Date.now()}`; // Cache Bust
        fetch(url, { cache: 'no-store' })
            .then(r => {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            })
            .then(data => {
                if (!data || !data.signs) throw new Error('Struktur ungültig');
                this.horoscope.date = data.date || '';
                // signs: { widder:{name,text}, ... }
                this.horoscope.signs = Object.entries(data.signs).map(([key, val]) => ({ key, name: val.name, text: val.text }));
                if (this.horoscope.signs.length === 0) throw new Error('Keine Zeichen');
                this.startHoroscopeRotation();
            })
            .catch(err => {
                console.warn('Horoskop Laden fehlgeschlagen:', err.message);
                if (this.messageEl) this.messageEl.textContent = 'Heute kein Horoskop verfügbar.';
            });
    }

    startHoroscopeRotation() {
        if (!this.messageEl) return;
        // Sofort erste Ausgabe
        this.updateHoroscopeMessage();
        // Alle 8s rotieren
        if (this.horoscope.timer) clearInterval(this.horoscope.timer);
        this.horoscope.timer = setInterval(() => this.updateHoroscopeMessage(), 8000);
    }

    updateHoroscopeMessage() {
        if (!this.horoscope.signs.length || !this.messageEl) return;
        const i = this.horoscope.cycleIndex % this.horoscope.signs.length;
        const entry = this.horoscope.signs[i];
        this.messageEl.style.opacity = 0;
        setTimeout(() => {
            this.messageEl.innerHTML = `<strong>${entry.name}:</strong> ${this.escapeHTML(entry.text)}`;
            if (this.horoscope.date) {
                this.messageEl.dataset.date = this.horoscope.date;
            }
            this.messageEl.style.opacity = 1;
        }, 300);
        this.horoscope.cycleIndex++;
    }

    escapeHTML(str) {
        return str.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c]));
    }
}

// Initialize the mystical creature when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking for horoskop page...');
    if (window.location.pathname.includes('horoskop')) {
        console.log('Horoskop page detected, initializing mystical creature...');
        try {
            const creature = new MysticalCreature();
            console.log('Mystical creature initialized successfully');
            
            // Add a visible indicator that the script is working
            setTimeout(() => {
                const textEl = document.getElementById('mysticalText');
                if (textEl && textEl.textContent.includes('kosmische Energie')) {
                    textEl.textContent = '🔮 Das Kristall-Orakel ist erwacht! ✨';
                    setTimeout(() => {
                        textEl.textContent = 'Die Kristallkugel zeigt deine kosmische Energie...';
                    }, 2000);
                }
            }, 1000);
        } catch (error) {
            console.error('Failed to initialize mystical creature:', error);
        }
    } else {
        console.log('Not on horoskop page, path:', window.location.pathname);
    }
});

export default MysticalCreature;
