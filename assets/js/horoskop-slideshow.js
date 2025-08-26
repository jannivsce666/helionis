// Horoscope Slideshow with Animated Constellations
class HoroscopeSlideshow {
    constructor() {
        this.currentSlide = 0;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 8000; // 8 seconds per slide
        
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

        this.init();
    }

    init() {
        this.setupCanvas();
        this.createSlides();
        this.setupControls();
        this.updateDate();
        this.startAutoPlay();
        this.showSlide(0);
    }

    setupCanvas() {
        this.canvas = document.getElementById('constellationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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
        
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
            autoplayBtn.textContent = '▶️';
            this.isAutoPlaying = false;
        } else {
            this.startAutoPlay();
            autoplayBtn.textContent = '⏸️';
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const scale = Math.min(this.canvas.width, this.canvas.height) * 0.3;

        // Draw stars
        constellation.stars.forEach(star => {
            const x = centerX + star.x * scale;
            const y = centerY + star.y * scale;
            
            this.drawStar(x, y, star.brightness);
        });

        // Draw connections
        constellation.connections.forEach(connection => {
            const star1 = constellation.stars[connection[0]];
            const star2 = constellation.stars[connection[1]];
            
            const x1 = centerX + star1.x * scale;
            const y1 = centerY + star1.y * scale;
            const x2 = centerX + star2.x * scale;
            const y2 = centerY + star2.y * scale;
            
            this.drawConnection(x1, y1, x2, y2);
        });
    }

    drawStar(x, y, brightness) {
        const radius = 2 + brightness * 3;
        const glowRadius = radius * 3;
        
        // Glow effect
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        gradient.addColorStop(0, `rgba(184, 115, 51, ${brightness})`);
        gradient.addColorStop(1, 'rgba(184, 115, 51, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Star center
        this.ctx.fillStyle = '#B87333';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawConnection(x1, y1, x2, y2) {
        this.ctx.strokeStyle = 'rgba(184, 115, 51, 0.4)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
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
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HoroscopeSlideshow();
});
