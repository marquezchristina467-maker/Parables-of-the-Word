
import { GoogleGenAI, Type } from "@google/genai";
import { Parable, ParableInsights } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchParableInsights = async (parable: Parable): Promise<ParableInsights> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide a comprehensive breakdown for the parable: "${parable.title}" from ${parable.reference}. 
    Your response must include:
    1. The full scripture text of the parable (English Standard Version or similar).
    2. A deep spiritual interpretation explaining the primary lessons and theological significance.
    3. Historical or cultural clarification for any confusing ancient idioms or customs.
    4. A practical, relatable modern-day example that demonstrates how this teaching applies to a person's life today.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scriptureText: {
            type: Type.STRING,
            description: "The full text of the parable from the Bible.",
          },
          interpretation: {
            type: Type.STRING,
            description: "The deep spiritual and theological meaning.",
          },
          clarification: {
            type: Type.STRING,
            description: "Historical or cultural context clarifications.",
          },
          modernExample: {
            type: Type.STRING,
            description: "A relatable modern application.",
          },
        },
        required: ["scriptureText", "interpretation", "clarification", "modernExample"],
      },
    },
  });

  const text = response.text || "{}";
  return JSON.parse(text) as ParableInsights;
};

export const chatAboutParable = async (parable: Parable, userMessage: string, history: {role: string, content: string}[]): Promise<string> => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a world-class Biblical scholar specializing in the Parables of Jesus. 
      You are helping a user explore "${parable.title}" (${parable.reference}). 
      Your tone is respectful, wise, and encouraging. Always connect your answers back to the teachings of Jesus. 
      If a user asks about the Greek or Hebrew context, provide that insight.`,
    },
  });

  const response = await chat.sendMessage({ message: userMessage });
  return response.text || "I'm sorry, I couldn't process that question.";
};

