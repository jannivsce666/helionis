# Netlify Deployment Setup

## Automatisches Deployment von GitHub zu Netlify

### 1. Netlify Secrets in GitHub Repository setzen

Gehe zu GitHub Repository → Settings → Secrets and variables → Actions und füge hinzu:

- `NETLIFY_AUTH_TOKEN`: Dein Netlify Personal Access Token
- `NETLIFY_SITE_ID`: Deine Netlify Site ID

### 2. Netlify Personal Access Token erstellen

1. Gehe zu [Netlify Personal Access Tokens](https://app.netlify.com/user/applications#personal-access-tokens)
2. Klicke "New access token"
3. Gib einen Namen ein (z.B. "GitHub Auto Deploy")
4. Kopiere den Token und füge ihn als `NETLIFY_AUTH_TOKEN` Secret hinzu

### 3. Netlify Site ID finden

1. Gehe zu deiner Netlify Site
2. Site settings → General → Site details
3. Kopiere die "Site ID" und füge sie als `NETLIFY_SITE_ID` Secret hinzu

### 4. Deployment Trigger

Das Deployment läuft automatisch bei:
- Push zu main branch
- Nach jedem täglichen Horoskop-Update (4:00 UTC)
- Bei Pull Requests (Preview)

### 5. Features

✅ Kristall-Orakel (mystical-creature.js)
✅ Tägliche Horoskop-Updates
✅ Mobile Optimierungen
✅ Firebase Authentication
✅ Automatische Cache-Kontrolle für JSON Updates

Das Kristall-Orakel ist bereits vollständig auf GitHub integriert und wird automatisch deployed!
