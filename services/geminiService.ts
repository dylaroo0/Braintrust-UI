
import { GoogleGenAI } from "@google/genai";
import type { Agent, Message } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAgentResponse = async (
  prompt: string,
  agent: Agent,
  history: Message[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API key is missing. Returning a mock response.");
    return `This is a mock response from ${agent.name}. The API key is not configured. My instructions are: "${agent.systemInstruction}"`;
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a simple history format for the model
    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    // Add the current prompt
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: agent.systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    return "Sorry, I encountered an error and couldn't process your request.";
  }
};
