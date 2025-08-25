// Horoscope functionality
class HoroscopeManager {
    constructor() {
        this.signs = {
            aries: { name: 'Widder', symbol: '♈', dates: '21.03 - 19.04' },
            taurus: { name: 'Stier', symbol: '♉', dates: '20.04 - 20.05' },
            gemini: { name: 'Zwillinge', symbol: '♊', dates: '21.05 - 20.06' },
            cancer: { name: 'Krebs', symbol: '♋', dates: '21.06 - 22.07' },
            leo: { name: 'Löwe', symbol: '♌', dates: '23.07 - 22.08' },
            virgo: { name: 'Jungfrau', symbol: '♍', dates: '23.08 - 22.09' },
            libra: { name: 'Waage', symbol: '♎', dates: '23.09 - 22.10' },
            scorpio: { name: 'Skorpion', symbol: '♏', dates: '23.10 - 21.11' },
            sagittarius: { name: 'Schütze', symbol: '♐', dates: '22.11 - 21.12' },
            capricorn: { name: 'Steinbock', symbol: '♑', dates: '22.12 - 19.01' },
            aquarius: { name: 'Wassermann', symbol: '♒', dates: '20.01 - 18.02' },
            pisces: { name: 'Fische', symbol: '♓', dates: '19.02 - 20.03' }
        };

        this.horoscopes = {
            aries: "Heute ist ein Tag voller Energie und neuer Möglichkeiten für dich, lieber Widder. Der Kosmos ermutigt dich, mutige Schritte zu wagen und deiner Intuition zu vertrauen. In zwischenmenschlichen Beziehungen zeigst du deine natürliche Führungsstärke, aber vergiss nicht, auch auf die Bedürfnisse anderer zu hören. Ein unerwartetes Gespräch könnte dir neue Perspektiven eröffnen. Die Sterne raten dir, deine impulsive Natur mit bedachtem Handeln zu balancieren. Am Abend ist Zeit für Reflexion und Dankbarkeit für die Fortschritte des Tages.",

            taurus: "Stabilität und Beständigkeit stehen heute im Mittelpunkt deines Lebens, geliebter Stier. Die kosmischen Energien unterstützen dich dabei, praktische Entscheidungen zu treffen und langfristige Ziele zu verfolgen. In finanziellen Angelegenheiten zeigt sich eine positive Wendung, die dir mehr Sicherheit bringt. Deine sinnliche Natur wird durch schöne Momente mit geliebten Menschen genährt. Die Sterne ermutigen dich, deine kreativen Talente zu entfalten und neue künstlerische Ausdrucksformen zu erkunden. Vertraue auf deine natürliche Weisheit und lass dich nicht von äußeren Turbulenzen aus der Ruhe bringen.",

            gemini: "Kommunikation und Austausch stehen heute im Zentrum deines Universums, lebendige Zwillinge. Deine natürliche Neugier führt dich zu interessanten Begegnungen und inspirierenden Gesprächen. Die Sterne begünstigen Lernprozesse und geistige Expansion – nutze diese Energie für neue Projekte oder Studien. In Beziehungen zeigst du deine charmante und witzige Seite, die andere magnetisch anzieht. Achte darauf, nicht zu viele Verpflichtungen gleichzeitig einzugehen. Deine Vielseitigkeit ist eine Gabe, aber heute ist Fokussierung der Schlüssel zum Erfolg. Vertraue auf deine schnelle Auffassungsgabe.",

            cancer: "Emotionale Tiefe und intuitive Weisheit prägen deinen heutigen Tag, lieber Krebs. Der Mond, dein Herrscherplanet, schenkt dir besondere Sensibilität für die Bedürfnisse deiner Mitmenschen. In familiären Angelegenheiten zeigst du deine fürsorgliche Natur und schaffst Harmonie. Die Sterne raten dir, auf deine innere Stimme zu hören und emotionale Entscheidungen zu vertrauen. Ein Moment der Stille am Wasser oder in der Natur wird dir neue Kraft schenken. Deine heilenden Fähigkeiten sind heute besonders stark – nutze sie, um dir und anderen zu helfen. Geborgenheit und Nähe sind deine heutigen Geschenke.",

            leo: "Strahlende Energie und kreative Kraft durchfluten dein Sein heute, majestätischer Löwe. Die Sonne illuminiert deinen Weg und zeigt dir neue Möglichkeiten zur Selbstverwirklichung. In beruflichen Angelegenheiten brillierst du mit deinem natürlichen Charisma und deiner Führungsstärke. Die Sterne ermutigen dich, deine künstlerischen Talente zu entfalten und dich auf der Bühne des Lebens zu zeigen. In der Liebe erwartet dich Leidenschaft und romantische Überraschungen. Vergiss nicht, dass wahre Größe auch Demut und Großzügigkeit einschließt. Teile dein Licht mit anderen und erleuchte ihre Welt mit deiner Wärme.",

            virgo: "Präzision und praktische Weisheit leiten dich heute, analytische Jungfrau. Die kosmischen Energien unterstützen dich dabei, Details zu perfektionieren und Ordnung in komplexe Situationen zu bringen. Deine methodische Herangehensweise führt zu bemerkenswerten Ergebnissen in wichtigen Projekten. Die Sterne raten dir, auch auf dein Wohlbefinden zu achten und gesunde Gewohnheiten zu pflegen. In zwischenmenschlichen Beziehungen zeigst du deine treue und verlässliche Natur. Manchmal ist es jedoch wichtig, auch spontan zu sein und die Perfektion loszulassen. Vertraue darauf, dass deine sorgfältige Arbeit geschätzt wird.",

            libra: "Harmonie und Balance bestimmen deinen heutigen Rhythmus, elegante Waage. Die Venus, dein Herrscherplanet, schenkt dir besondere Anmut in sozialen Situationen und künstlerischen Unternehmungen. Beziehungen stehen im Mittelpunkt, und du zeigst deine Fähigkeit, zwischen verschiedenen Standpunkten zu vermitteln. Die Sterne ermutigen dich, ästhetische Erfahrungen zu suchen und dich von Schönheit inspirieren zu lassen. In Entscheidungsprozessen wägst du alle Optionen sorgfältig ab – vertraue auf dein natürliches Gefühl für Gerechtigkeit. Ein diplomatisches Gespräch könnte zu einer wichtigen Lösung führen. Lass deine natürliche Eleganz heute strahlen.",

            scorpio: "Transformative Kraft und mystische Einsichten durchdringen dein Bewusstsein heute, intensiver Skorpion. Pluto verleiht dir die Macht, tief unter die Oberfläche zu blicken und verborgene Wahrheiten zu entdecken. In emotionalen Angelegenheiten zeigst du deine Fähigkeit, durch Krisen zu navigieren und stärker daraus hervorzugehen. Die Sterne raten dir, deiner Intuition zu vertrauen und spirituelle Praktiken zu vertiefen. Geheimnisse könnten gelüftet werden, die dir neue Perspektiven eröffnen. Deine magnetische Ausstrahlung zieht andere in deinen Bann. Nutze deine transformative Energie weise und denke daran, dass wahre Macht in der Selbstbeherrschung liegt.",

            sagittarius: "Abenteuergeist und philosophische Weisheit bestimmen deinen Weg heute, freier Schütze. Jupiter erweitert deinen Horizont und ermutigt dich, neue Länder zu erkunden oder dein Wissen zu vertiefen. Deine optimistische Natur inspiriert andere und öffnet Türen zu unerwarteten Möglichkeiten. Die Sterne begünstigen Reisen, Studien und spirituelle Entdeckungen. In Gesprächen teilst du deine visionären Ideen und erweiterst das Bewusstsein deiner Mitmenschen. Manchmal ist es wichtig, auch bei den Details zu bleiben und nicht nur die großen Zusammenhänge zu sehen. Dein Glaube an das Gute im Leben ist deine größte Stärke und zieht positive Erfahrungen an.",

            capricorn: "Ausdauer und strategisches Denken führen dich heute zum Erfolg, ambitionierter Steinbock. Saturn verleiht dir die Disziplin, langfristige Ziele zu verfolgen und Hindernisse zu überwinden. Deine praktische Herangehensweise und dein Verantwortungsbewusstsein werden von anderen geschätzt und respektiert. Die Sterne raten dir, auch Zeit für Entspannung und persönliche Beziehungen einzuplanen. Berufliche Anerkennung und materielle Sicherheit sind in greifbare Nähe gerückt. Deine Beständigkeit ist eine seltene Gabe in unserer schnelllebigen Welt. Vergiss nicht, auch die kleinen Freuden des Lebens zu würdigen und deine Erfolge zu feiern.",

            aquarius: "Innovation und humanitäre Visionen prägen deinen heutigen Tag, fortschrittlicher Wassermann. Uranus inspiriert dich zu revolutionären Ideen und unkonventionellen Lösungen für gesellschaftliche Probleme. Deine Individualität und dein Wunsch nach Freiheit führen dich zu interessanten Begegnungen mit Gleichgesinnten. Die Sterne ermutigen dich, technologische Innovationen zu erforschen und futuristische Projekte zu starten. In Freundschaften zeigst du deine loyale und unterstützende Natur. Manchmal ist es wichtig, auch emotionale Nähe zuzulassen und nicht nur intellektuell zu agieren. Deine Vision einer besseren Welt kann Realität werden, wenn du andere für deine Ideale begeisterst.",

            pisces: "Intuitive Weisheit und mitfühlende Energie durchfließen dein Sein heute, empfindsame Fische. Neptun öffnet die Tore zu spirituellen Dimensionen und kreativen Inspirationen. Deine Fähigkeit, die Emotionen anderer zu verstehen, macht dich zu einem wertvollen Freund und Berater. Die Sterne begünstigen künstlerische Projekte und meditative Praktiken. In der Liebe zeigst du deine romantische und hingebungsvolle Natur. Achte darauf, auch deine eigenen Grenzen zu wahren und dich nicht in den Problemen anderer zu verlieren. Ein Traum oder eine Vision könnte dir wichtige Botschaften übermitteln. Vertraue auf deine psychischen Fähigkeiten und lass deine Fantasie fließen."
        };

        this.init();
    }

    init() {
        this.updateMoonPhase();
        this.bindEvents();
    }

    updateMoonPhase() {
        try {
            const moonPhaseEl = document.getElementById('currentMoonPhase');
            if (moonPhaseEl) {
                const phase = this.calculateMoonPhase();
                const moonText = moonPhaseEl.querySelector('.moon-text');
                if (moonText) {
                    moonText.textContent = `${phase.phase} (Tag ${phase.day})`;
                }
            }
        } catch (error) {
            console.warn('Moon phase calculation failed:', error);
        }
    }

    calculateMoonPhase(d = new Date()) {
        const year = d.getUTCFullYear();
        const month = d.getUTCMonth() + 1;
        const day = d.getUTCDate();
        
        let r = year % 100;
        r %= 19;
        if (r > 9) r -= 19;
        r = ((r * 11) % 30) + month + day + (month < 3 ? 2 : 0) - (year < 2000 ? 4 : 8.3);
        r = Math.floor(r + 0.5) % 30;
        if (r < 0) r += 30;
        
        const names = ["Neumond", "Zunehmend", "Erstes Viertel", "Zunehmender Mond", "Vollmond", "Abnehmend", "Letztes Viertel", "Abnehmender Mond"];
        const idx = r === 0 ? 0 : r < 7 ? 1 : r === 7 ? 2 : r < 15 ? 3 : r === 15 ? 4 : r < 22 ? 5 : r === 22 ? 6 : 7;
        
        return { day: r, phase: names[idx] };
    }

    bindEvents() {
        const zodiacCards = document.querySelectorAll('.zodiac-card');
        zodiacCards.forEach(card => {
            card.addEventListener('click', () => {
                const sign = card.getAttribute('data-sign');
                this.showHoroscope(sign);
            });
        });
    }

    showHoroscope(sign) {
        const signData = this.signs[sign];
        const horoscope = this.horoscopes[sign];
        
        if (!signData || !horoscope) return;

        // Update horoscope display
        document.getElementById('selectedSymbol').textContent = signData.symbol;
        document.getElementById('selectedSignName').textContent = signData.name;
        document.getElementById('horoscopeDate').textContent = new Date().toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('horoscopeText').textContent = horoscope;

        // Show horoscope section
        document.querySelector('.zodiac-selector').style.display = 'none';
        document.querySelector('.daily-inspiration').style.display = 'none';
        document.getElementById('horoscopeDisplay').style.display = 'block';

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Global function to show zodiac selector (called from HTML)
function showZodiacSelector() {
    document.querySelector('.zodiac-selector').style.display = 'block';
    document.querySelector('.daily-inspiration').style.display = 'block';
    document.getElementById('horoscopeDisplay').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize horoscope manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new HoroscopeManager();
});
