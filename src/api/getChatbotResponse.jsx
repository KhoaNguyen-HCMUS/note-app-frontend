import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate API key exists
const apiKey = import.meta.env.VITE_APP_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Missing Gemini API key - please add it to .env file');
}

// Initialize the API client with correct configuration
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

export async function getChatbotResponse(message) {
  try {
    // Create a chat session
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    // Generate response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to get response from AI');
  }
}
