// Mystical Creature Animation for Horoscope Page
class MysticalCreature {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.lastFrameTime = 0;
        this.targetFPS = 30; // Standardwert
        this.frameInterval = 1000 / this.targetFPS;
        
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
        
        // Neues Orakel-System
        this.oracle = {
            isActive: false,
            currentQuestion: 0,
            questions: [
                "Was beschäftigt dein Herz am meisten in dieser Zeit?",
                "Welche Veränderung sehnst du dir in deinem Leben herbei?", 
                "Vor welcher Entscheidung stehst du gerade?"
            ],
            answers: [],
            cards: [],
            isReadingCards: false,
            speechBubble: null
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
        this.setupVisibilityHandler(); // Pausiere bei inaktivem Tab
        this.initOracleSystem(); // Neues Orakel-System
    }

    setupVisibilityHandler() {
        // Pausiere Animationen wenn Tab nicht sichtbar ist
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pausiere Animation
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
                console.log('Animation paused - tab hidden');
            } else {
                // Starte Animation wieder
                if (!this.animationId) {
                    this.animate();
                    console.log('Animation resumed - tab visible');
                }
            }
        });
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
        
        // Add visible border for debugging and interaction
        this.canvas.style.border = '2px solid rgba(184, 115, 51, 0.3)';
        this.canvas.style.borderRadius = '15px';
        this.canvas.style.background = 'rgba(13, 13, 13, 0.5)';
        this.canvas.style.cursor = 'pointer'; // Zeigt an, dass es klickbar ist
        this.canvas.style.transition = 'all 0.3s ease'; // Für Hover-Effekte
        
        // Check for mobile device
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window;
        
        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Mobile performance optimizations
        if (this.isMobile) {
            this.targetFPS = this.prefersReducedMotion ? 5 : 10; // Noch langsamere FPS auf Mobile, extrem langsam bei reduced motion
            this.frameInterval = 1000 / this.targetFPS;
            console.log('Mobile device detected - reducing animation to', this.targetFPS, 'FPS');
        } else {
            this.targetFPS = this.prefersReducedMotion ? 15 : 30;
            this.frameInterval = 1000 / this.targetFPS;
        }
        
        // Adjust animation speed for mobile
        this.animationSpeed = this.isMobile ? (this.prefersReducedMotion ? 0.05 : 0.1) : (this.prefersReducedMotion ? 0.3 : 1.0);
        
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
                    <p id="mysticalText">🔮 Klicke auf die Kristallkugel für eine Orakel-Lesung...</p>
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
        // Create floating stars around the creature - reduce count on mobile
        const starCount = this.isMobile ? 4 : 8; // Weniger Sterne auf Mobile
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                twinkle: Math.random() * Math.PI * 2,
                speed: (Math.random() * 0.02 + 0.01) * (this.isMobile ? 0.1 : 1.0) // Noch langsamere Sterne auf Mobile
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
        // Disable orb rotation on mobile for better performance and less distraction
        if (!this.isMobile) {
            this.ctx.rotate(rotation * 0.5);
        }
        
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
        
        // Reduce or disable rotation on mobile
        const runeRotation = this.isMobile ? rotation * 0.1 : rotation; // Kaum Rotation auf Mobile
        
        for (let i = 0; i < 4; i++) {
            this.ctx.save();
            
            const angle = (i / 4) * Math.PI * 2 + runeRotation;
            const distance = size/1.2;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            this.ctx.translate(x, y);
            // Disable individual rune rotation on mobile
            if (!this.isMobile) {
                this.ctx.rotate(runeRotation * (i % 2 === 0 ? 1 : -1));
            }
            
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
        
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastFrameTime;
        
        // Frame rate control - only animate when enough time has passed
        if (elapsed >= this.frameInterval) {
            try {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Mobile-optimized speed multiplier - extrem langsam für Mobile
                const speedMultiplier = this.isMobile ? 0.02 : 0.5; // Noch viel langsamere Geschwindigkeit auf Mobile
                
                // Update creature animations with mobile-aware speed
                this.creature.floatOffset += 0.02 * speedMultiplier * this.animationSpeed;
                this.creature.rotation += (this.isMobile ? 0.001 : 0.008) * speedMultiplier * this.animationSpeed; // Kaum Rotation auf Mobile
                this.creature.haloRotation += (this.isMobile ? 0.002 : 0.015) * speedMultiplier * this.animationSpeed; // Kaum Halo-Rotation auf Mobile
                
                // Draw everything
                this.drawStars();
                this.drawCreature();
                
                this.lastFrameTime = currentTime;
            } catch (error) {
                console.error('Animation error:', error);
                // Try to show fallback if animation fails
                this.showFallbackOrb();
                return;
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        // Stoppe alle Animationen und Timer
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.horoscope.timer) {
            clearInterval(this.horoscope.timer);
            this.horoscope.timer = null;
        }
        
        // Entferne Event Listener
        if (this.canvas) {
            this.canvas.removeEventListener('mouseenter', this.mouseEnterHandler);
            this.canvas.removeEventListener('mouseleave', this.mouseLeaveHandler);
            this.canvas.removeEventListener('click', this.clickHandler);
        }
        
        console.log('MysticalCreature destroyed and animations stopped');
    }

    setupInteraction() {
        if (!this.canvas) return;
        
        // Speichere Handler-Referenzen für cleanup
        this.mouseEnterHandler = () => {
            if (!this.oracle.isActive) {
                this.canvas.style.transform = 'scale(1.05)';
                this.canvas.style.borderColor = 'rgba(255, 215, 0, 0.6)';
                this.canvas.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
            }
        };
        
        this.mouseLeaveHandler = () => {
            if (!this.oracle.isActive) {
                this.canvas.style.transform = 'scale(1)';
                this.canvas.style.borderColor = 'rgba(184, 115, 51, 0.3)';
                this.canvas.style.boxShadow = 'none';
            }
        };
        
        this.clickHandler = () => {
            // Starte Orakel-Session beim Klick auf die Kristallkugel
            if (!this.oracle.isActive) {
                this.startOracleSession();
            } else {
                // Add some sparkle effect on click wenn Orakel bereits aktiv - nur auf Desktop
                if (!this.isMobile) {
                    this.createClickSparkles();
                }
            }
        };
        
        // Reduziere Interaktionen auf Mobile für bessere Performance
        if (!this.isMobile) {
            this.canvas.addEventListener('mouseenter', this.mouseEnterHandler);
            this.canvas.addEventListener('mouseleave', this.mouseLeaveHandler);
        }
        
        this.canvas.addEventListener('click', this.clickHandler);
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

    // ===== ORAKEL-SYSTEM =====
    
    initOracleSystem() {
        this.createOracleUI();
        this.setupOracleInteraction();
    }

    createOracleUI() {
        const container = document.getElementById('creatureContainer');
        if (!container) return;

        // Sprechblase erstellen
        this.createSpeechBubble(container);
        
        // Karten-Container erstellen
        this.createCardsContainer(container);
    }

    createSpeechBubble(container) {
        const bubble = document.createElement('div');
        bubble.id = 'oracle-speech-bubble';
        bubble.className = 'speech-bubble';
        bubble.style.cssText = `
            position: absolute;
            top: -80px;
            left: 50%;
            transform: translateX(-50%) scale(0);
            background: rgba(184, 115, 51, 0.95);
            color: #FFD700;
            padding: 20px;
            border-radius: 20px;
            max-width: 300px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-size: 16px;
            line-height: 1.4;
            z-index: 1000;
        `;

        // Sprechblasen-Pfeil
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid rgba(184, 115, 51, 0.95);
        `;
        bubble.appendChild(arrow);

        container.appendChild(bubble);
        this.oracle.speechBubble = bubble;
    }

    createCardsContainer(container) {
        // Nutze den bestehenden mystical-text Bereich für die Karten
        const mysticalTextElement = document.getElementById('mysticalText');
        if (!mysticalTextElement) {
            console.warn('mysticalText element not found');
            return;
        }

        // Verstecke den ursprünglichen Text und verwende den Platz für Karten
        const cardsContainer = document.createElement('div');
        cardsContainer.id = 'oracle-cards-container';
        cardsContainer.style.cssText = `
            display: none;
            gap: 20px;
            opacity: 0;
            transition: all 0.8s ease;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 100%;
            padding: 20px 0;
        `;

        // Füge den Karten-Container zum bestehenden mystical-text Bereich hinzu
        mysticalTextElement.parentNode.appendChild(cardsContainer);
    }

    setupOracleInteraction() {
        // Oracle wird direkt über die Kristallkugel gestartet
        // Kein separater Button mehr nötig
    }

    startOracleSession() {
        this.oracle.isActive = true;
        this.oracle.currentQuestion = 0;
        this.oracle.answers = [];

        // Erste Frage stellen
        setTimeout(() => {
            this.askQuestion();
        }, 500);
    }

    askQuestion() {
        const question = this.oracle.questions[this.oracle.currentQuestion];
        this.showSpeechBubble(question, () => {
            this.createAnswerInput();
        });
    }

    showSpeechBubble(text, callback) {
        const bubble = this.oracle.speechBubble;
        if (!bubble) return;

        // Text mit Typewriter-Effekt
        bubble.innerHTML = '';
        bubble.style.transform = 'translateX(-50%) scale(1)';
        bubble.style.opacity = '1';

        // Pfeil hinzufügen
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid rgba(184, 115, 51, 0.95);
        `;

        this.typeWriter(bubble, text, 50, () => {
            bubble.appendChild(arrow);
            if (callback) {
                setTimeout(callback, 1000);
            }
        });
    }

    typeWriter(element, text, speed, callback) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                if (callback) callback();
            }
        }, speed);
    }

    createAnswerInput() {
        const bubble = this.oracle.speechBubble;
        if (!bubble) return;

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            margin-top: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const input = document.createElement('textarea');
        input.placeholder = 'Deine Antwort...';
        input.rows = 3;
        input.style.cssText = `
            background: rgba(26, 26, 26, 0.8);
            border: 2px solid #FFD700;
            border-radius: 10px;
            padding: 10px;
            color: #FFD700;
            font-size: 14px;
            resize: none;
            outline: none;
            width: 100%;
            box-sizing: border-box;
            font-family: inherit;
        `;
        
        // Prevent event bubbling issues
        input.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });
        
        input.addEventListener('keyup', (e) => {
            e.stopPropagation();
        });
        
        input.addEventListener('input', (e) => {
            e.stopPropagation();
        });

        const submitBtn = document.createElement('button');
        submitBtn.innerHTML = '✨ Antworten';
        submitBtn.style.cssText = `
            background: linear-gradient(45deg, #FFD700, #B87333);
            border: none;
            padding: 8px 16px;
            border-radius: 15px;
            color: #1a1a1a;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        submitBtn.addEventListener('click', () => {
            const answer = input.value.trim();
            if (answer) {
                this.handleAnswer(answer);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitBtn.click();
            }
        });

        inputContainer.appendChild(input);
        inputContainer.appendChild(submitBtn);
        bubble.appendChild(inputContainer);

        // Fokus auf Input
        setTimeout(() => input.focus(), 100);
    }

    handleAnswer(answer) {
        this.oracle.answers.push(answer);
        
        // Sprechblase ausblenden
        const bubble = this.oracle.speechBubble;
        if (bubble) {
            bubble.style.transform = 'translateX(-50%) scale(0)';
            bubble.style.opacity = '0';
        }

        // Nächste Frage oder Karten legen
        setTimeout(() => {
            this.oracle.currentQuestion++;
            
            if (this.oracle.currentQuestion < this.oracle.questions.length) {
                this.askQuestion();
            } else {
                this.layCards();
            }
        }, 800);
    }

    layCards() {
        this.showSpeechBubble('Die Karten werden gelegt... 🔮', () => {
            setTimeout(() => {
                this.oracle.speechBubble.style.opacity = '0';
                this.oracle.speechBubble.style.transform = 'translateX(-50%) scale(0)';
                this.createTarotCards();
            }, 2000);
        });
    }

    createTarotCards() {
        const cardsContainer = document.getElementById('oracle-cards-container');
        const mysticalTextElement = document.getElementById('mysticalText');
        
        if (!cardsContainer || !mysticalTextElement) {
            console.warn('Required elements not found for tarot cards');
            return;
        }

        // Verstecke den ursprünglichen Text
        mysticalTextElement.style.display = 'none';
        
        // Zeige den Karten-Container
        cardsContainer.style.display = 'flex';
        cardsContainer.style.opacity = '1';

        const cardNames = ['Vergangenheit', 'Gegenwart', 'Zukunft'];
        
        cardNames.forEach((name, index) => {
            setTimeout(() => {
                const card = this.createTarotCard(name, index);
                cardsContainer.appendChild(card);
                
                // Animation
                setTimeout(() => {
                    card.style.transform = 'rotateY(0deg) scale(1)';
                    card.style.opacity = '1';
                }, 100);
                
                // Wenn alle Karten gelegt sind
                if (index === cardNames.length - 1) {
                    setTimeout(() => {
                        this.enableCardReading();
                    }, 500);
                }
            }, index * 600);
        });
    }

    createTarotCard(name, index) {
        const card = document.createElement('div');
        card.className = 'tarot-card';
        card.dataset.index = index;
        
        card.style.cssText = `
            width: 90px;
            height: 140px;
            background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
            border: 3px solid #B87333;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.5s ease;
            transform: rotateY(180deg) scale(0.8);
            opacity: 0;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        `;

        // Karten-Rückseite
        const cardBack = document.createElement('div');
        cardBack.innerHTML = `
            <div style="text-align: center; color: #FFD700;">
                <div style="font-size: 24px; margin-bottom: 10px;">🌟</div>
                <div style="font-size: 12px; font-weight: bold;">${name}</div>
                <div style="font-size: 10px; margin-top: 5px; opacity: 0.7;">Klicke für Deutung</div>
            </div>
        `;
        
        card.appendChild(cardBack);
        return card;
    }

    enableCardReading() {
        const cards = document.querySelectorAll('.tarot-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (this.oracle.isReadingCards) return;
                
                this.oracle.isReadingCards = true;
                this.readCard(parseInt(card.dataset.index));
            });

            // Hover-Effekte
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'rotateY(0deg) scale(1.1)';
                card.style.boxShadow = '0 12px 35px rgba(184, 115, 51, 0.4)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateY(0deg) scale(1)';
                card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            });
        });
    }

    async readCard(cardIndex) {
        const cardNames = ['Vergangenheit', 'Gegenwart', 'Zukunft'];
        const cardName = cardNames[cardIndex];
        
        // Loading-Animation auf Karte
        const card = document.querySelector(`[data-index="${cardIndex}"]`);
        if (card) {
            card.innerHTML = `
                <div style="text-align: center; color: #FFD700;">
                    <div style="font-size: 16px; animation: spin 1s linear infinite;">🔮</div>
                    <div style="font-size: 12px; margin-top: 10px;">Lese die Karten...</div>
                </div>
            `;
        }

        try {
            // OpenAI API Call für Kartendeutung
            const reading = await this.getCardReading(cardIndex, this.oracle.answers);
            this.displayCardReading(cardIndex, cardName, reading);
        } catch (error) {
            console.error('Card reading failed:', error);
            this.displayCardReading(cardIndex, cardName, "Die Energien sind heute zu schwach für eine klare Deutung. Versuche es später erneut.");
        }
    }

    async getCardReading(cardIndex, answers) {
        const cardAspects = ['Vergangenheit', 'Gegenwart', 'Zukunft'];
        const aspect = cardAspects[cardIndex];
        
        const prompt = `Du bist ein mystischer Tarot-Experte. Basierend auf diesen spirituellen Antworten:
        
        1. "${answers[0]}"
        2. "${answers[1]}" 
        3. "${answers[2]}"
        
        Erstelle eine tiefgehende Tarot-Deutung für "${aspect}" für den nächsten Monat. 
        
        Die Deutung soll:
        - Mystisch und inspirierend sein
        - Konkrete Hinweise für den nächsten Monat enthalten
        - Positive und aufbauende Energie vermitteln
        - Maximal 150 Wörter lang sein
        - In deutscher Sprache verfasst sein
        
        Beginne direkt mit der Deutung, ohne Anrede.`;

        try {
            const response = await fetch('/.netlify/functions/oracle-reading', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    cardIndex: cardIndex
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data.reading;
        } catch (error) {
            console.warn('Netlify function not available, using fallback reading');
            // Fallback-Deutungen wenn die API nicht verfügbar ist
            return this.getFallbackReading(cardIndex, aspect);
        }
    }

    getFallbackReading(cardIndex, aspect) {
        const fallbackReadings = {
            0: { // Vergangenheit
                readings: [
                    "Die Vergangenheit hat dich gelehrt, dass wahre Stärke aus innerer Ruhe erwächst. Erfahrungen, die einst schmerzhaft waren, erweisen sich nun als wertvolle Lektionen. Die Sterne zeigen, dass vergangene Hindernisse zu deiner spirituellen Entwicklung beigetragen haben.",
                    "Aus den Schatten der Vergangenheit tritt eine neue Erkenntnis hervor. Was einst als Rückschlag erschien, war in Wahrheit ein notwendiger Schritt auf deinem spirituellen Pfad. Die kosmischen Kräfte haben dich durch diese Zeit geführt, um dich auf das vorzubereiten, was kommt.",
                    "Die Vergangenheit whispert Geheimnisse der Weisheit. Erkenne, dass jede Prüfung dich näher zu deinem wahren Selbst gebracht hat. Die Kristalle der Zeit haben deine Seele geschliffen und zu dem Diamanten geformt, der du heute bist."
                ]
            },
            1: { // Gegenwart  
                readings: [
                    "In diesem Moment stehst du an einem mächtigen Wendepunkt. Die Energien des Universums sammeln sich um dich, bereit, neue Türen zu öffnen. Vertraue deiner Intuition und erkenne die Zeichen, die dir der Kosmos sendet.",
                    "Die Gegenwart ist durchdrungen von magischen Möglichkeiten. Deine spirituelle Energie erreicht einen Höhepunkt - nutze diese kraftvolle Zeit für Manifestation und innere Klarheit. Die Sterne stehen günstig für transformative Durchbrüche.",
                    "Jetzt ist die Zeit der Ernte gekommen. Was du gesät hast, beginnt zu blühen. Die mystischen Kräfte unterstützen dich dabei, deine Träume in die Realität zu bringen. Öffne dein Herz für die Wunder, die sich bereits zeigen."
                ]
            },
            2: { // Zukunft
                readings: [
                    "Die Zukunft strahlt in goldenem Licht vor dir. Ein Pfad des Wachstums und der Erfüllung öffnet sich. Die kosmischen Winde tragen dich zu neuen Horizonten, wo Träume Wirklichkeit werden und deine wahre Bestimmung erwacht.",
                    "Vor dir liegt eine Zeit großer spiritueller Expansion. Die Sterne weisen den Weg zu tieferer Erkenntnis und authentischer Lebensfreude. Bereite dich auf transformative Begegnungen vor, die dein Leben in wundervoller Weise verändern werden.",
                    "Die Zukunft birgt Geschenke der Weisheit und des Friedens. Dein spiritueller Weg führt dich zu einer Zeit der Harmonie, in der sich deine höchsten Visionen manifestieren. Vertraue dem Fluss des Universums - es führt dich zu deinem Glück."
                ]
            }
        };

        const cardReadings = fallbackReadings[cardIndex];
        if (cardReadings) {
            const randomIndex = Math.floor(Math.random() * cardReadings.readings.length);
            return cardReadings.readings[randomIndex];
        }

        return "Die kosmischen Energien sind heute zu schwach für eine klare Deutung. Versuche es zu einem anderen Zeitpunkt erneut.";
    }

    displayCardReading(cardIndex, cardName, reading) {
        const card = document.querySelector(`[data-index="${cardIndex}"]`);
        if (!card) return;

        // Karte umdrehen und Deutung anzeigen
        card.style.transform = 'rotateY(180deg)';
        
        setTimeout(() => {
            card.innerHTML = `
                <div style="padding: 10px; text-align: center; height: 100%; display: flex; flex-direction: column;">
                    <div style="color: #FFD700; font-weight: bold; font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #B87333; padding-bottom: 5px;">
                        ${cardName}
                    </div>
                    <div style="color: #B87333; font-size: 11px; line-height: 1.3; overflow-y: auto; flex: 1;">
                        ${reading}
                    </div>
                </div>
            `;
            
            card.style.transform = 'rotateY(0deg)';
            card.style.cursor = 'default';
        }, 300);

        // Wenn alle Karten gelesen wurden
        setTimeout(() => {
            this.oracle.isReadingCards = false;
            this.showOracleComplete();
        }, 1000);
    }

    showOracleComplete() {
        setTimeout(() => {
            this.showSpeechBubble('Die Karten haben gesprochen. Möge ihre Weisheit dich leiten! ✨', () => {
                setTimeout(() => {
                    this.resetOracle();
                }, 3000);
            });
        }, 2000);
    }

    resetOracle() {
        // Alles zurücksetzen
        this.oracle.isActive = false;
        this.oracle.currentQuestion = 0;
        this.oracle.answers = [];
        this.oracle.isReadingCards = false;

        // UI zurücksetzen
        const bubble = this.oracle.speechBubble;
        const cards = document.getElementById('oracle-cards-container');
        const mysticalTextElement = document.getElementById('mysticalText');

        if (bubble) {
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateX(-50%) scale(0)';
        }

        if (cards) {
            cards.style.opacity = '0';
            cards.style.display = 'none';
            cards.innerHTML = '';
        }

        // Zeige den ursprünglichen Text wieder an
        if (mysticalTextElement) {
            mysticalTextElement.style.display = 'block';
        }
    }
}

// Initialize the mystical creature when DOM is loaded

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
