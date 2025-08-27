const https = require('https');

exports.handler = async (event, context) => {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight request
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
        const { prompt, cardIndex } = JSON.parse(event.body);
        
        if (!prompt) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Prompt required' })
            };
        }

        // OpenAI API Key aus Umgebungsvariablen
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY not found in environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'API configuration error' })
            };
        }

        // OpenAI API Call
        const response = await callOpenAI(prompt, apiKey);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                reading: response,
                cardIndex: cardIndex
            })
        };

    } catch (error) {
        console.error('Oracle reading error:', error);
        
        // Fallback-Deutungen bei API-Fehlern
        const fallbackReadings = [
            "Die Energien der Vergangenheit zeigen tiefe Verbindungen zu deinen Wurzeln. Alte Wunden heilen und geben dir neue Kraft für kommende Herausforderungen.", // Vergangenheit
            "Die Gegenwart birgt Möglichkeiten, die nur darauf warten, ergriffen zu werden. Deine Intuition ist stark - vertraue auf deine innere Stimme.", // Gegenwart  
            "Die Zukunft erstrahlt in goldenen Tönen. Ein neuer Lebensabschnitt kündigt sich an, der Wachstum und Erfüllung bringen wird." // Zukunft
        ];
        
        const cardIndex = JSON.parse(event.body).cardIndex || 0;
        const fallbackReading = fallbackReadings[cardIndex] || fallbackReadings[0];
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                reading: fallbackReading,
                cardIndex: cardIndex,
                fallback: true
            })
        };
    }
};

function callOpenAI(prompt, apiKey) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Du bist ein weiser und mystischer Tarot-Experte mit jahrzehntelanger Erfahrung. Deine Deutungen sind tiefgehend, spirituell und voller Weisheit."
                },
                {
                    role: "user", 
                    content: prompt
                }
            ],
            max_tokens: 200,
            temperature: 0.8
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    
                    if (response.error) {
                        reject(new Error(response.error.message));
                        return;
                    }
                    
                    const reading = response.choices[0].message.content.trim();
                    resolve(reading);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}
