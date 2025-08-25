# Empyreal - Mystische Esoterik Website

Eine elegante, mystische Website für esoterische Produkte mit modernem Design und spiritueller Ausstrahlung.

## 🔮 Features

- **Responsive Design**: Perfekt optimiert für Desktop, Tablet und Mobile
- **Video Integration**: Hover-Effekte und Autoplay-Videos für Produktpräsentation
- **Horoskop-System**: Tägliche Horoskope für alle 12 Sternzeichen mit Mondphasen
- **Interaktiver Shop**: Produktkatalog mit detaillierten Beschreibungen
- **Spirituelle Inhalte**: Über-uns Seite mit Symbolerklärungen
- **Mobile-First**: Optimiert für beste Handy-Darstellung

## 🛠 Technologien

- **HTML5**: Semantische Struktur mit Schema.org Markup
- **CSS3**: Modern CSS mit Flexbox, Grid und Animationen
- **Vanilla JavaScript**: ES6+ Module ohne externe Dependencies
- **Responsive Design**: Mobile-first Ansatz mit 768px/480px Breakpoints

## 📱 Mobile Optimierung

- Große, lesbare Schriftarten (16-18px base)
- Touch-optimierte Buttons und Navigation
- Optimierte Video-Darstellung
- Responsive Layouts für alle Bildschirmgrößen

## 🎥 Video Features

- Hero-Video mit Autoplay auf der Startseite
- Hover-Effekte für Produktkarten mit individuellen Videos
- Auto-playing Videos auf der Über-uns Seite
- Optimierte Performance mit Fallback-Bildern

## 🌟 Horoskop-System

- 12 detaillierte Sternzeichen-Horoskope
- Automatische Mondphasen-Berechnung
- Interaktive Sternzeichen-Auswahl
- Mobile-optimierte Darstellung

## 🛒 E-Commerce Features

- 8 Produktkategorien (Pyramiden, Würfel, Amulette)
- Detaillierte Produktbeschreibungen per Modal
- Individuelle Fertigung und energetische Aufladung
- Responsive Produktkarten mit Hover-Effekten

## 📁 Projektstruktur

```
mystic_esoterik_site/
├── index.html              # Startseite
├── about.html              # Über uns
├── shop.html               # Shop-Übersicht
├── horoskop.html           # Horoskop-Seite
├── news.html               # News
├── assets/
│   ├── css/
│   │   └── styles.css      # Haupt-Stylesheet
│   ├── js/
│   │   ├── main.js         # Haupt-JavaScript
│   │   └── horoscope.js    # Horoskop-Funktionalität
│   ├── images/             # Produktbilder und Assets
│   └── data/
│       └── news.json       # News-Daten
├── videos/                 # Produktvideos
└── README.md
```

## 🚀 Installation & Setup

1. Repository klonen:
```bash
git clone [repository-url]
cd mystic_esoterik_site
```

2. Website lokal öffnen:
```bash
# Mit Python Server
python -m http.server 8000

# Mit Node.js serve
npx serve .

# Oder direkt index.html im Browser öffnen
```

## 🎨 Design-Prinzipien

- **Dunkles Theme**: Hauptsächlich schwarze Hintergründe (#1a1a1a)
- **Goldene Akzente**: Luxuriöse goldene Farbe (#D4AF37)
- **Mystische Atmosphäre**: Subtile Animationen und Glow-Effekte
- **Saubere Typografie**: Georgia Serif für Überschriften, moderne Sans-Serif für Text

## 📱 Mobile Features

- Viewport-optimierte Meta-Tags
- Touch-freundliche Buttons (min. 44px)
- Optimierte Schriftgrößen für Lesbarkeit
- Responsive Bilder mit srcset
- Performance-optimierte Videos

## 🔧 Anpassungen

### Video-Dateien hinzufügen
Videos sollten im `videos/` Ordner platziert werden:
- `start.mp4` - Hero-Video
- `cube.mp4` - Würfel-Produktvideo  
- `amulet.mp4` - Amulett-Produktvideo

### Produktbilder
Bilder sollten im `assets/images/` Ordner sein:
- `pyramid.png`, `cube.png`, `amulet.png` - Produktbilder
- `logo.svg` - Logo
- `hero_mock.png` - Fallback Hero-Bild

## 📄 Lizenz

Dieses Projekt ist für Empyreal entwickelt worden.

## 🤝 Contribution

Für Änderungen und Verbesserungen bitte Issues oder Pull Requests erstellen.

---

*Entwickelt mit ✨ spiritueller Energie und 💻 moderner Technologie*
