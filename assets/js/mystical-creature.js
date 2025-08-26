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
        this.fetchHoroscopeData(); // Neu: Daily Horoscope laden
    }

    createCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'mystical-creature-canvas';
        this.canvas.width = 300;
        this.canvas.height = 350;
        this.canvas.style.cssText = `
            position: relative;
            margin: 2rem auto;
            display: block;
            z-index: 1000;
            pointer-events: auto;
            border-radius: 15px;
            background: rgba(13, 13, 13, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(184, 115, 51, 0.2);
            cursor: pointer;
            transition: transform 0.3s ease;
            box-shadow: 0 8px 32px rgba(184, 115, 51, 0.15);
        `;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Add under horoscope content
        if (window.location.pathname.includes('horoskop.html')) {
            const cosmicWisdom = document.querySelector('.cosmic-wisdom');
            const parentContainer = cosmicWisdom ? cosmicWisdom.parentNode : 
                                  document.querySelector('main') || 
                                  document.body;
            
            // Create a container for the creature
            const creatureContainer = document.createElement('div');
            creatureContainer.style.cssText = `
                text-align: center;
                padding: 2rem 0;
                margin-top: 3rem;
            `;
            
            const title = document.createElement('h3');
            title.textContent = '✨ Dein Kristall-Orakel ✨';
            title.style.cssText = `
                color: #B87333;
                font-family: 'Playfair Display', serif;
                font-size: 1.5rem;
                margin-bottom: 1rem;
                text-align: center;
                text-shadow: 0 0 10px rgba(184, 115, 51, 0.5);
            `;
            
            creatureContainer.appendChild(title);
            creatureContainer.appendChild(this.canvas);
            
            // Neu: Platz für laufenden Horoskop-Text
            const msg = document.createElement('div');
            msg.id = 'daily-horoscope-rotation';
            msg.style.cssText = `
                margin-top: 0.75rem;
                font-size: 0.95rem;
                line-height: 1.3;
                min-height: 2.4rem;
                color: #e9d3bf;
                font-family: 'Inter', sans-serif;
                max-width: 420px;
                padding: 0.6rem 1rem;
                margin-left: auto;
                margin-right: auto;
                background: rgba(184,115,51,0.08);
                border: 1px solid rgba(184,115,51,0.25);
                border-radius: 12px;
                backdrop-filter: blur(6px);
                box-shadow: 0 4px 18px -4px rgba(0,0,0,0.4);
                transition: opacity .4s ease;
            `;
            msg.textContent = 'Lade tägliche Horoskope…';
            creatureContainer.appendChild(msg);
            this.messageEl = msg;
            
            // Insert after cosmic wisdom section
            if (cosmicWisdom) {
                cosmicWisdom.insertAdjacentElement('afterend', creatureContainer);
            } else {
                parentContainer.appendChild(creatureContainer);
            }
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Detect mobile devices and slow down animations
        const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
        const speedMultiplier = isMobile ? 0.3 : 1; // 70% slower on mobile
        
        // Update creature animations with mobile-aware speed
        this.creature.floatOffset += 0.02 * speedMultiplier;
        this.creature.rotation += 0.008 * speedMultiplier;
        this.creature.haloRotation += 0.015 * speedMultiplier;
        
        // Blinking logic - removed for crystal orb
        // Crystal orb doesn't blink, it pulses with energy
        
        // Draw everything
        this.drawStars();
        this.drawCreature();
        
        requestAnimationFrame(() => this.animate());
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
    if (window.location.pathname.includes('horoskop.html')) {
        new MysticalCreature();
    }
});

export default MysticalCreature;
