#!/usr/bin/env node
/**
 * Generates daily horoscope JSON using OpenAI API.
 * Output: assets/data/horoscope.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_PATH = path.join(__dirname, '..', 'assets', 'data', 'horoscope.json');

const today = new Date().toISOString().slice(0,10);

// Avoid duplicate generation if same date already exists (local dev safeguard)
if (fs.existsSync(OUT_PATH)) {
  try {
    const existing = JSON.parse(fs.readFileSync(OUT_PATH,'utf8'));
    if (existing.date === today) {
      console.log('Horoscope already generated for today.');
      process.exit(0);
    }
  } catch {}
}

const signs = [
  { key:'widder', name:'Widder' },
  { key:'stier', name:'Stier' },
  { key:'zwillinge', name:'Zwillinge' },
  { key:'krebs', name:'Krebs' },
  { key:'loewe', name:'Löwe' },
  { key:'jungfrau', name:'Jungfrau' },
  { key:'waage', name:'Waage' },
  { key:'skorpion', name:'Skorpion' },
  { key:'schuetze', name:'Schütze' },
  { key:'steinbock', name:'Steinbock' },
  { key:'wassermann', name:'Wassermann' },
  { key:'fische', name:'Fische' }
];

const prompt = `Erzeuge für HEUTE kurze tägliche Horoskope (max 55 Wörter je Zeichen) in modernem, mystischem, positivem Ton.\nKein esoterischer Overkill, kein Datum wiederholen.\nLiefere AUSSCHLIESSLICH valid JSON:\n{\n  "widder":"...",\n  "stier":"...",\n  "zwillinge":"...",\n  "krebs":"...",\n  "loewe":"...",\n  "jungfrau":"...",\n  "waage":"...",\n  "skorpion":"...",\n  "schuetze":"...",\n  "steinbock":"...",\n  "wassermann":"...",\n  "fische":"..."\n}\nNur Texte, kein Zusatz. Deutsch.`.trim();

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY fehlt');
    process.exit(1);
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: 'Du bist ein präziser JSON Generator für deutsche Horoskope.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Fehler', res.status, errorText);
      
      // Bei Quota-Fehlern: Fallback verwenden
      if (res.status === 429 || errorText.includes('quota')) {
        console.log('OpenAI Quota erreicht - verwende Fallback Horoskope');
        createFallbackHoroscope();
        return;
      }
      process.exit(1);
    }

    const data = await res.json();
    let raw = data.choices?.[0]?.message?.content || '';
    let jsonText = raw.trim();
    const first = jsonText.indexOf('{');
    const last = jsonText.lastIndexOf('}');
    if (first !== -1 && last !== -1) jsonText = jsonText.slice(first, last + 1);

    let parsed;
    try { parsed = JSON.parse(jsonText); } catch (e) {
      console.error('Parsing fehlgeschlagen. Antwort:', raw);
      console.log('Verwende Fallback Horoskope');
      createFallbackHoroscope();
      return;
    }

    for (const s of signs) {
      if (!parsed[s.key]) parsed[s.key] = 'Die Sterne sind heute verschleiert.';
    }

    const output = {
      date: today,
      generated_at: new Date().toISOString(),
      signs: Object.fromEntries(signs.map(s => [s.key, { name: s.name, text: parsed[s.key].trim() }]))
    };

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf8');
    console.log('Horoskope gespeichert ->', OUT_PATH);
    
  } catch (error) {
    console.error('Unerwarteter Fehler:', error.message);
    console.log('Verwende Fallback Horoskope');
    createFallbackHoroscope();
  }
}

function createFallbackHoroscope() {
  const fallbackTexts = {
    widder: 'Die Sterne zeigen neue Möglichkeiten auf. Vertraue deiner Intuition.',
    stier: 'Stabilität und Beständigkeit prägen deinen Tag. Bleibe geerdet.',
    zwillinge: 'Kommunikation öffnet heute neue Türen. Sei offen für Gespräche.',
    krebs: 'Emotionale Tiefe bringt Klarheit. Höre auf dein Herz.',
    loewe: 'Deine natürliche Ausstrahlung steht heute im Mittelpunkt.',
    jungfrau: 'Präzision und Aufmerksamkeit führen zum Erfolg.',
    waage: 'Balance und Harmonie sind heute deine Stärken.',
    skorpion: 'Transformation liegt in der Luft. Umarme Veränderungen.',
    schuetze: 'Neue Horizonte warten darauf, entdeckt zu werden.',
    steinbock: 'Ausdauer und Zielstrebigkeit zahlen sich aus.',
    wassermann: 'Innovation und Originalität bringen Fortschritt.',
    fische: 'Intuition und Kreativität fließen besonders stark.'
  };

  const output = {
    date: today,
    generated_at: new Date().toISOString(),
    source: 'fallback',
    signs: Object.fromEntries(signs.map(s => [s.key, { name: s.name, text: fallbackTexts[s.key] }]))
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf8');
  console.log('Fallback Horoskope gespeichert ->', OUT_PATH);
}

main().catch(e => { console.error(e); process.exit(1); });
