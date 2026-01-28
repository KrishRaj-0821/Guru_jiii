
import { GoogleGenAI, Type } from "@google/genai";
import { EducationalContent, Language } from "../types";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from "../constants";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    EL15: {
      type: Type.STRING,
      description: 'Simple explanation for a 15-year-old.',
    },
    'Deep Dive': {
      type: Type.STRING,
      description: 'Detailed markdown-formatted content.',
    },
    'Visual Analogy': {
      type: Type.STRING,
      description: 'English text describing a visual analogy for image generation.',
    },
    Resources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, description: 'book, article, video, or website' },
          url: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['title', 'type', 'url', 'description'],
      },
    },
  },
  required: ['EL15', 'Deep Dive', 'Visual Analogy', 'Resources'],
};

export const generateEducationalContent = async (
  topic: string,
  language: Language
): Promise<EducationalContent> => {
  // Always initialize a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Generate the structured educational content
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Teach me about: ${topic} in the language: ${language}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No educational content was generated.");
    }
    const data = JSON.parse(text.trim());

    // Generate a high-quality visual analogy image using Gemini 2.5 Flash Image
    let imageUrl: string | undefined;
    try {
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A clear, professional educational illustration visualizing the following analogy for a learning platform: ${data['Visual Analogy']}`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      // Find the image part in the response candidates
      const parts = imageResponse.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (imageErr) {
      console.warn("Failed to generate image via Gemini API, proceeding with text only:", imageErr);
    }

    return {
      el15: data.EL15,
      deepDive: data['Deep Dive'],
      visualAnalogy: data['Visual Analogy'],
      resources: data.Resources,
      imageUrl
    };
  } catch (error) {
    console.error("Guru Jii Content Generation Error:", error);
    throw new Error("Guru Jii is busy right now. Please try again in a moment.");
  }
};
