
import { GoogleGenAI, Modality } from "@google/genai";
import type { Panel } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function preprocessStory(story: string, panels: number): Panel[] {
  const sentences = story.split(/[.?!]/).filter(s => s.trim().length > 0);
  const panelCount = Math.min(sentences.length, panels);
  return sentences.slice(0, panelCount).map((s, i) => ({
    scene: `Panel ${i + 1} scene based on: ${s.trim()}`,
    action: `Action from: ${s.trim()}`,
    mood: "natural"
  }));
}

export async function generateCharacterCard(story: string, style: string): Promise<string> {
  const prompt = `Create a character reference sheet. Style: ${style}. Main character: inferred from story "${story}". Show 3 angles, neutral poses, white background. No text.`;
  
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("No character image was generated.");
  } catch (error) {
    console.error("Error generating character card:", error);
    throw new Error("Failed to generate character card. Please check the console for details.");
  }
}

export async function generateComicPanel(panelData: Panel, style: string, characterCardBase64: string): Promise<string> {
  const prompt = `Using the character in the provided image as a reference, draw a ${style} style comic panel. Scene: "${panelData.scene}". Action: "${panelData.action}". Mood: "${panelData.mood}". Do not include any text, speech bubbles, or lettering in the image. The panel should be purely visual.`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: characterCardBase64,
    },
  };
  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const imagePartResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePartResponse?.inlineData) {
      return imagePartResponse.inlineData.data;
    }
    
    throw new Error("Could not extract image from panel generation response.");
  } catch (error) {
    console.error("Error generating comic panel:", error);
    throw new Error("Failed to generate a comic panel. Please check the console for details.");
  }
}
