const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "KEy_HERE"; // Get from environment variables
const API_URL_FLASH = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const handleApiResponse = async (response) => {
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`);
    }
    const result = await response.json();
    if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
        return result.candidates[0].content.parts[0].text;
    }
    throw new Error("Invalid response structure from AI.");
};

export const analyzeReport = async (file, prompt) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            try {
                const base64ImageData = reader.result.split(',')[1];
                const payload = {
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: file.type, data: base64ImageData } }
                        ]
                    }],
                };
                const response = await fetch(API_URL_FLASH, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const textResponse = await handleApiResponse(response);
                const cleanedJsonString = textResponse.replace(/```json|```/g, '').trim();
                resolve(JSON.parse(cleanedJsonString));
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = error => reject(error);
    });
};


export const generateWellnessPlan = async (healthDataSummary, prompt) => {
    const fullPrompt = `${prompt}\n\nHealth Data: ${healthDataSummary}`;
    const payload = {
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
            response_mime_type: "application/json",
        }
    };
    const response = await fetch(API_URL_FLASH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const textResponse = await handleApiResponse(response);
    return JSON.parse(textResponse);
};


export const getSymptomResponse = async (messages) => {
    // Add a system prompt for better medical advice
    const systemPrompt = `You are an AI medical assistant that helps users understand their symptoms. Please provide helpful, preliminary insights while emphasizing that this is not a substitute for professional medical advice. 

Guidelines:
- Be empathetic and supportive
- Ask clarifying questions about symptoms (duration, severity, associated symptoms)
- Suggest when to seek immediate medical attention
- Provide general information about possible conditions
- Always recommend consulting a healthcare professional for proper diagnosis
- Be cautious with serious symptoms and recommend emergency care when appropriate

Keep responses concise but informative.`;

    const chatHistory = [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...messages.map(msg => ({
            role: msg.sender === 'ai' ? "model" : "user",
            parts: [{ text: msg.text }]
        }))
    ];

    const payload = { 
        contents: chatHistory,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
        }
    };
    
    const response = await fetch(API_URL_FLASH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await handleApiResponse(response);
};