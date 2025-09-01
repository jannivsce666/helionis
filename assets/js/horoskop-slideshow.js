// Horoscope Slideshow with Animated Constellations
class HoroscopeSlideshow {
    constructor() {
        this.currentSlide = 0;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 8000; // 8 seconds per slide
        this.dailyHoroscopes = null;
        
        this.zodiacData = [
            {
                sign: 'aries',
                name: 'Widder',
                dates: '21. März - 19. April',
                symbol: '♈',
                horoscope: 'Heute ist ein Tag voller Energie und neuer Möglichkeiten. Deine natürliche Führungskraft wird gebraucht. Vertraue auf deine Instinkte und wage den ersten Schritt in Richtung deiner Träume.',
                keywords: ['Energie', 'Führung', 'Mut', 'Neubeginn'],
                constellation: this.getAriesConstellation()
            },
            {
                sign: 'taurus',
                name: 'Stier',
                dates: '20. April - 20. Mai',
                symbol: '♉',
                horoscope: 'Stabilität und Sicherheit stehen heute im Vordergrund. Deine praktische Herangehensweise wird zu langfristigem Erfolg führen. Genieße die kleinen Freuden des Lebens.',
                keywords: ['Stabilität', 'Sicherheit', 'Genuss', 'Beständigkeit'],
                constellation: this.getTaurusConstellation()
            },
            {
                sign: 'gemini',
                name: 'Zwillinge',
                dates: '21. Mai - 20. Juni',
                symbol: '♊',
                horoscope: 'Kommunikation und Austausch stehen heute im Mittelpunkt. Deine Vielseitigkeit öffnet neue Türen. Sei offen für interessante Gespräche und unerwartete Begegnungen.',
                keywords: ['Kommunikation', 'Vielseitigkeit', 'Neugier', 'Flexibilität'],
                constellation: this.getGeminiConstellation()
            },
            {
                sign: 'cancer',
                name: 'Krebs',
                dates: '21. Juni - 22. Juli',
                symbol: '♋',
                horoscope: 'Heute ist ein Tag für emotionale Verbindungen und familiäre Harmonie. Deine Intuition führt dich zu den richtigen Entscheidungen. Höre auf dein Herz und vertraue deinen Gefühlen.',
                keywords: ['Intuition', 'Familie', 'Emotionen', 'Schutz'],
                constellation: this.getCancerConstellation()
            },
            {
                sign: 'leo',
                name: 'Löwe',
                dates: '23. Juli - 22. August',
                symbol: '♌',
                horoscope: 'Deine natürliche Ausstrahlung zieht heute alle Blicke auf sich. Es ist Zeit, im Rampenlicht zu stehen und deine Talente zu zeigen. Selbstvertrauen und Kreativität sind deine Stärken.',
                keywords: ['Selbstvertrauen', 'Kreativität', 'Rampenlicht', 'Großzügigkeit'],
                constellation: this.getLeoConstellation()
            },
            {
                sign: 'virgo',
                name: 'Jungfrau',
                dates: '23. August - 22. September',
                symbol: '♍',
                horoscope: 'Perfektion und Details stehen heute im Fokus. Deine analytischen Fähigkeiten helfen dir, Ordnung in das Chaos zu bringen. Kleine Verbesserungen führen zu großen Veränderungen.',
                keywords: ['Perfektion', 'Analyse', 'Ordnung', 'Hilfsbereitschaft'],
                constellation: this.getVirgoConstellation()
            },
            {
                sign: 'libra',
                name: 'Waage',
                dates: '23. September - 22. Oktober',
                symbol: '♎',
                horoscope: 'Harmonie und Balance bestimmen deinen Tag. Deine diplomatischen Fähigkeiten sind gefragt. Suche nach fairen Lösungen und bringe Menschen zusammen.',
                keywords: ['Harmonie', 'Balance', 'Diplomatie', 'Gerechtigkeit'],
                constellation: this.getLibraConstellation()
            },
            {
                sign: 'scorpio',
                name: 'Skorpion',
                dates: '23. Oktober - 21. November',
                symbol: '♏',
                horoscope: 'Transformation und tiefe Einsichten prägen diesen Tag. Deine Intensität und Leidenschaft führen zu bedeutsamen Veränderungen. Vertraue auf deine innere Stärke.',
                keywords: ['Transformation', 'Intensität', 'Leidenschaft', 'Tiefe'],
                constellation: this.getScorpioConstellation()
            },
            {
                sign: 'sagittarius',
                name: 'Schütze',
                dates: '22. November - 21. Dezember',
                symbol: '♐',
                horoscope: 'Abenteuer und neue Horizonte rufen dich heute. Dein Optimismus und deine Weisheit inspirieren andere. Es ist Zeit für große Pläne und weite Reisen des Geistes.',
                keywords: ['Abenteuer', 'Optimismus', 'Weisheit', 'Freiheit'],
                constellation: this.getSagittariusConstellation()
            },
            {
                sign: 'capricorn',
                name: 'Steinbock',
                dates: '22. Dezember - 19. Januar',
                symbol: '♑',
                horoscope: 'Disziplin und Ausdauer bringen dich heute deinen Zielen näher. Deine praktische Herangehensweise zahlt sich aus. Setze auf bewährte Methoden und langfristige Strategien.',
                keywords: ['Disziplin', 'Ausdauer', 'Ziele', 'Erfolg'],
                constellation: this.getCapricornConstellation()
            },
            {
                sign: 'aquarius',
                name: 'Wassermann',
                dates: '20. Januar - 18. Februar',
                symbol: '♒',
                horoscope: 'Innovation und Originalität stehen heute im Vordergrund. Deine einzigartige Sichtweise bringt frischen Wind in alte Strukturen. Denke über den Tellerrand hinaus.',
                keywords: ['Innovation', 'Originalität', 'Freiheit', 'Humanität'],
                constellation: this.getAquariusConstellation()
            },
            {
                sign: 'pisces',
                name: 'Fische',
                dates: '19. Februar - 20. März',
                symbol: '♓',
                horoscope: 'Intuition und Kreativität fließen heute besonders stark. Deine empathische Natur hilft anderen und dir selbst. Vertraue auf deine spirituelle Verbindung zum Universum.',
                keywords: ['Intuition', 'Kreativität', 'Empathie', 'Spiritualität'],
                constellation: this.getPiscesConstellation()
            }
        ];

        this.loadDailyHoroscopes().then(() => {
            this.init();
        });
    }

    async loadDailyHoroscopes() {
        try {
            const response = await fetch('assets/data/horoscope.json');
            const data = await response.json();
            this.dailyHoroscopes = data.signs;
            
            console.log('Täglich Horoskope geladen für:', data.date);
            console.log('Anzahl Sternzeichen:', Object.keys(this.dailyHoroscopes).length);
            
            // Update zodiac data with daily horoscopes
            this.updateHoroscopeTexts();
        } catch (error) {
            console.warn('Konnte tägliche Horoskope nicht laden, verwende Standard-Texte:', error);
        }
    }

    updateHoroscopeTexts() {
        if (!this.dailyHoroscopes) return;

        const signMapping = {
            'aries': 'widder',
            'taurus': 'stier', 
            'gemini': 'zwillinge',
            'cancer': 'krebs',
            'leo': 'loewe',
            'virgo': 'jungfrau',
            'libra': 'waage',
            'scorpio': 'skorpion',
            'sagittarius': 'schuetze',
            'capricorn': 'steinbock',
            'aquarius': 'wassermann',
            'pisces': 'fische'
        };

        let updatedCount = 0;
        this.zodiacData.forEach(zodiac => {
            const dailyKey = signMapping[zodiac.sign];
            if (dailyKey && this.dailyHoroscopes[dailyKey]) {
                zodiac.horoscope = this.dailyHoroscopes[dailyKey].text;
                updatedCount++;
            }
        });
        
        console.log(`${updatedCount} Horoskop-Texte erfolgreich aktualisiert`);
    }

    init() {
        this.setupCanvas();
        this.createStars();
        this.createSlides();
        this.setupControls();
        this.updateDate();
        this.startStarAnimation();
        this.startAutoPlay();
        this.showSlide(0);
    }

    setupCanvas() {
        this.canvas = document.getElementById('constellationCanvas');
        if (!this.canvas) {
            console.warn('Constellation canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        this.backgroundStars = [];
        const starCount = window.innerWidth < 768 ? 30 : 60; // Fewer stars on mobile
        
        for (let i = 0; i < starCount; i++) {
            this.backgroundStars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    startStarAnimation() {
        if (!this.canvas || !this.ctx) return;
        
        const animate = () => {
            this.drawStarBackground();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    drawStarBackground() {
        // Clear canvas with dark space background
        this.ctx.fillStyle = 'rgba(13, 13, 13, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw twinkling stars
        this.backgroundStars.forEach((star, index) => {
            const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset);
            const alpha = star.opacity * (0.5 + 0.5 * twinkle);
            
            // Star glow
            const glowSize = star.size * 4;
            const gradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
            gradient.addColorStop(0, `rgba(184, 115, 51, ${alpha * 0.8})`);
            gradient.addColorStop(1, 'rgba(184, 115, 51, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Star center
            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Gentle floating motion
            star.y += Math.sin(Date.now() * 0.0005 + index) * 0.1;
            star.x += Math.cos(Date.now() * 0.0003 + index) * 0.05;
            
            // Wrap around edges
            if (star.x > this.canvas.width) star.x = 0;
            if (star.x < 0) star.x = this.canvas.width;
            if (star.y > this.canvas.height) star.y = 0;
            if (star.y < 0) star.y = this.canvas.height;
        });
    }

    createSlides() {
        const slidesContainer = document.getElementById('horoscopeSlides');
        const indicatorsContainer = document.getElementById('slideIndicators');
        
        this.zodiacData.forEach((zodiac, index) => {
            // Create slide
            const slide = document.createElement('div');
            slide.className = 'horoscope-slide';
            slide.innerHTML = `
                <div class="slide-symbol">
                    <svg viewBox="0 0 64 64" class="zodiac-icon"><use href="assets/images/mystical-sprites.svg#${zodiac.sign}"></use></svg>
                </div>
                <h2 class="slide-title">${zodiac.name} ${zodiac.symbol}</h2>
                <p class="slide-dates">${zodiac.dates}</p>
                <div class="slide-horoscope">${zodiac.horoscope}</div>
                <div class="slide-keywords">
                    ${zodiac.keywords.map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
                </div>
            `;
            slidesContainer.appendChild(slide);

            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.showSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }

    setupControls() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const autoplayBtn = document.getElementById('autoplayBtn');

        prevBtn.addEventListener('click', () => this.prevSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        autoplayBtn.addEventListener('click', () => this.toggleAutoPlay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });
    }

    showSlide(index) {
        const slides = document.querySelectorAll('.horoscope-slide');
        const indicators = document.querySelectorAll('.indicator');

        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Show current slide
        this.currentSlide = index;
        slides[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].classList.add('active');

        // Draw constellation
        this.drawConstellation(this.zodiacData[this.currentSlide].constellation);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.zodiacData.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.zodiacData.length) % this.zodiacData.length;
        this.showSlide(prevIndex);
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    toggleAutoPlay() {
        const autoplayBtn = document.getElementById('autoplayBtn');
        const svgUse = autoplayBtn.querySelector('use');
        
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
            svgUse.setAttribute('href', 'assets/images/mystical-sprites.svg#mystical-play');
            this.isAutoPlaying = false;
        } else {
            this.startAutoPlay();
            svgUse.setAttribute('href', 'assets/images/mystical-sprites.svg#mystical-pause');
            this.isAutoPlaying = true;
        }
    }

    updateDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = 
            now.toLocaleDateString('de-DE', options);
    }

    drawConstellation(constellation) {
        // Don't clear the canvas - draw over the star background
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const scale = Math.min(this.canvas.width, this.canvas.height) * 0.3;

        // Draw connections first (behind stars)
        constellation.connections.forEach(connection => {
            const star1 = constellation.stars[connection[0]];
            const star2 = constellation.stars[connection[1]];
            
            const x1 = centerX + star1.x * scale;
            const y1 = centerY + star1.y * scale;
            const x2 = centerX + star2.x * scale;
            const y2 = centerY + star2.y * scale;
            
            this.drawConnection(x1, y1, x2, y2);
        });

        // Draw constellation stars on top
        constellation.stars.forEach(star => {
            const x = centerX + star.x * scale;
            const y = centerY + star.y * scale;
            
            this.drawStar(x, y, star.brightness, true); // true for constellation star
        });
    }

    drawStar(x, y, brightness, isConstellation = false) {
        const radius = isConstellation ? 3 + brightness * 4 : 2 + brightness * 3;
        const glowRadius = radius * (isConstellation ? 4 : 3);
        const alpha = isConstellation ? Math.min(1, brightness + 0.3) : brightness;
        
        // Enhanced glow effect for constellation stars
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        
        if (isConstellation) {
            gradient.addColorStop(0, `rgba(255, 215, 0, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(184, 115, 51, ${alpha * 0.8})`);
            gradient.addColorStop(1, 'rgba(184, 115, 51, 0)');
        } else {
            gradient.addColorStop(0, `rgba(184, 115, 51, ${alpha})`);
            gradient.addColorStop(1, 'rgba(184, 115, 51, 0)');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Star center
        this.ctx.fillStyle = isConstellation ? '#FFD700' : '#B87333';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawConnection(x1, y1, x2, y2) {
        this.ctx.strokeStyle = 'rgba(184, 115, 51, 0.7)';
        this.ctx.lineWidth = 1.5;
        this.ctx.shadowColor = '#B87333';
        this.ctx.shadowBlur = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    // Constellation data (simplified representations)
    getAriesConstellation() {
        return {
            stars: [
                { x: 0, y: -0.8, brightness: 0.9 },
                { x: -0.3, y: -0.4, brightness: 0.7 },
                { x: 0.2, y: -0.2, brightness: 0.8 },
                { x: -0.1, y: 0.1, brightness: 0.6 }
            ],
            connections: [[0, 1], [1, 2], [2, 3]]
        };
    }

    getTaurusConstellation() {
        return {
            stars: [
                { x: -0.5, y: -0.6, brightness: 0.9 },
                { x: 0, y: -0.4, brightness: 0.8 },
                { x: 0.4, y: -0.3, brightness: 0.7 },
                { x: 0.2, y: 0, brightness: 0.6 },
                { x: -0.2, y: 0.1, brightness: 0.7 }
            ],
            connections: [[0, 1], [1, 2], [1, 3], [1, 4]]
        };
    }

    getGeminiConstellation() {
        return {
            stars: [
                { x: -0.4, y: -0.6, brightness: 0.8 },
                { x: -0.2, y: -0.2, brightness: 0.7 },
                { x: 0, y: 0.2, brightness: 0.6 },
                { x: 0.2, y: -0.2, brightness: 0.7 },
                { x: 0.4, y: -0.6, brightness: 0.8 }
            ],
            connections: [[0, 1], [1, 2], [3, 4], [1, 3]]
        };
    }

    getCancerConstellation() {
        return {
            stars: [
                { x: -0.3, y: -0.5, brightness: 0.6 },
                { x: 0, y: -0.2, brightness: 0.8 },
                { x: 0.3, y: -0.5, brightness: 0.6 },
                { x: 0.1, y: 0.2, brightness: 0.7 }
            ],
            connections: [[0, 1], [1, 2], [1, 3]]
        };
    }

    getLeoConstellation() {
        return {
            stars: [
                { x: -0.6, y: -0.4, brightness: 0.9 },
                { x: -0.2, y: -0.6, brightness: 0.8 },
                { x: 0.2, y: -0.3, brightness: 0.7 },
                { x: 0.5, y: 0, brightness: 0.8 },
                { x: 0.2, y: 0.4, brightness: 0.6 },
                { x: -0.3, y: 0.2, brightness: 0.7 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
        };
    }

    getVirgoConstellation() {
        return {
            stars: [
                { x: -0.4, y: -0.7, brightness: 0.8 },
                { x: -0.1, y: -0.5, brightness: 0.7 },
                { x: 0.2, y: -0.3, brightness: 0.9 },
                { x: 0.4, y: 0, brightness: 0.6 },
                { x: 0.1, y: 0.3, brightness: 0.7 },
                { x: -0.3, y: 0.1, brightness: 0.6 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [2, 4], [1, 5]]
        };
    }

    getLibraConstellation() {
        return {
            stars: [
                { x: -0.4, y: -0.3, brightness: 0.8 },
                { x: 0, y: -0.5, brightness: 0.9 },
                { x: 0.4, y: -0.3, brightness: 0.8 },
                { x: -0.2, y: 0.2, brightness: 0.7 },
                { x: 0.2, y: 0.2, brightness: 0.7 }
            ],
            connections: [[0, 1], [1, 2], [0, 3], [2, 4], [3, 4]]
        };
    }

    getScorpioConstellation() {
        return {
            stars: [
                { x: -0.5, y: -0.6, brightness: 0.8 },
                { x: -0.2, y: -0.4, brightness: 0.9 },
                { x: 0, y: -0.1, brightness: 0.8 },
                { x: 0.2, y: 0.2, brightness: 0.7 },
                { x: 0.5, y: 0.5, brightness: 0.6 },
                { x: 0.7, y: 0.3, brightness: 0.7 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
        };
    }

    getSagittariusConstellation() {
        return {
            stars: [
                { x: -0.3, y: -0.6, brightness: 0.8 },
                { x: 0, y: -0.3, brightness: 0.9 },
                { x: 0.3, y: 0, brightness: 0.7 },
                { x: 0.6, y: 0.3, brightness: 0.6 },
                { x: 0.2, y: 0.5, brightness: 0.7 },
                { x: -0.1, y: 0.2, brightness: 0.8 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [1, 5], [5, 4]]
        };
    }

    getCapricornConstellation() {
        return {
            stars: [
                { x: -0.5, y: -0.2, brightness: 0.8 },
                { x: -0.2, y: -0.5, brightness: 0.7 },
                { x: 0.1, y: -0.3, brightness: 0.9 },
                { x: 0.4, y: -0.1, brightness: 0.6 },
                { x: 0.3, y: 0.3, brightness: 0.7 },
                { x: 0, y: 0.5, brightness: 0.8 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
        };
    }

    getAquariusConstellation() {
        return {
            stars: [
                { x: -0.4, y: -0.4, brightness: 0.7 },
                { x: -0.1, y: -0.6, brightness: 0.8 },
                { x: 0.2, y: -0.4, brightness: 0.9 },
                { x: 0.5, y: -0.2, brightness: 0.7 },
                { x: 0.2, y: 0.2, brightness: 0.6 },
                { x: -0.2, y: 0.1, brightness: 0.8 },
                { x: -0.5, y: 0.3, brightness: 0.6 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [1, 5], [5, 6], [2, 4]]
        };
    }

    getPiscesConstellation() {
        return {
            stars: [
                { x: -0.6, y: -0.3, brightness: 0.7 },
                { x: -0.3, y: -0.5, brightness: 0.8 },
                { x: 0, y: -0.2, brightness: 0.6 },
                { x: 0.3, y: -0.5, brightness: 0.8 },
                { x: 0.6, y: -0.3, brightness: 0.7 },
                { x: -0.2, y: 0.3, brightness: 0.9 },
                { x: 0.2, y: 0.3, brightness: 0.9 }
            ],
            connections: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [3, 6], [5, 6]]
        };
    }

    // Cleanup method to stop animations
    destroy() {
        this.stopAnimation();
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.resizeCanvas);
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HoroscopeSlideshow();
});
