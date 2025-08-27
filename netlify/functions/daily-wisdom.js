exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { OpenAI } = await import('openai');
        
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured');
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Get current date for consistent daily wisdom
        const today = new Date().toISOString().split('T')[0];
        
        const prompt = `Du bist ein weiser spiritueller Meister der Astrologie und kosmischen Weisheit. 
        
        Erstelle für den heutigen Tag (${today}) eine tiefgehende, inspirierende Weisheit über:
        - Kosmische Energien und Sternenhimmel
        - Spirituelle Entwicklung und Bewusstsein
        - Harmonie zwischen Mensch und Universum
        - Mystische Erkenntnisse für den Alltag
        
        Die Weisheit soll:
        - Poetisch und mystisch formuliert sein
        - Positive und aufbauende Energie vermitteln
        - Zum Nachdenken anregen
        - Maximal 2 Sätze lang sein
        - In deutscher Sprache verfasst sein
        - Ohne Anführungszeichen beginnen und enden
        
        Beispiel: "Die Sterne flüstern Geheimnisse für jene, die mit dem Herzen hören. Im kosmischen Tanz der Planeten liegt der Schlüssel zu unserer inneren Transformation."
        
        Beginne direkt mit der Weisheit:`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Du bist ein weiser spiritueller Astrologe und Philosoph.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 150,
            temperature: 0.8
        });

        const wisdom = response.choices[0]?.message?.content?.trim();

        if (!wisdom) {
            throw new Error('No wisdom generated');
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                wisdom: wisdom,
                date: today,
                success: true
            })
        };

    } catch (error) {
        console.error('Cosmic wisdom error:', error);
        
        // Fallback wisdom messages
        const fallbackWisdoms = [
            "Die Sterne sind Tore zu unendlichen Möglichkeiten - öffne dein Herz für ihre Führung. Jeder Moment birgt kosmische Weisheit für den, der aufmerksam lauscht.",
            "Im Rhythmus der Planeten schwingt die Melodie deiner Seele mit. Vertraue dem universellen Fluss, der dich zu deiner wahren Bestimmung führt.",
            "Die Weisheit des Kosmos offenbart sich in der Stille zwischen den Gedanken. Atme tief und spüre die unendliche Verbindung zu allem, was ist.",
            "Wie die Sterne am Himmel ihren Platz haben, so hat auch deine Seele ihre einzigartige Position im großen Ganzen. Ehre deine kosmische Rolle.",
            "Die Energien des Universums fließen durch dich hindurch - sei ein bewusster Kanal für Licht und Liebe. Deine Schwingung verändert die Welt um dich herum."
        ];
        
        const today = new Date().toISOString().split('T')[0];
        const dayIndex = today.split('-').reduce((sum, part) => sum + parseInt(part), 0) % fallbackWisdoms.length;
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                wisdom: fallbackWisdoms[dayIndex],
                date: today,
                success: true,
                fallback: true
            })
        };
    }
};
