import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (apiKey && apiKey !== 'AIzaSy...') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Google Gemini API initialized.');
  } catch (err) {
    console.warn('⚠️ Could not initialize Gemini API:', err);
  }
} else {
  console.log('ℹ️ GEMINI_API_KEY not configured. Skill Setu AI engine will use built-in domain intelligent fallback generator.');
}

export function getGeminiModel(modelName = 'gemini-1.5-flash') {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
}

export { genAI };
