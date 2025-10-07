import { GoogleGenAI } from "@google/genai";
import { Perspective, StorySearchResult, RealStory } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A mock implementation for environments where API_KEY is not set.
  console.warn("API_KEY is not set. Using mock Gemini service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const searchRealStories = async (disasterName: string, perspective: Perspective): Promise<StorySearchResult> => {
  if (!ai) {
    return new Promise(resolve => setTimeout(() => {
        resolve({
            summary: `這是一個關於「${disasterName}」從「${perspective}」視角的模擬搜尋結果。網路上的真實報導記錄了災難當下的震撼以及人們如何互助與重建的感人故事。`,
            stories: [
                { title: `[模擬] ${disasterName} ${perspective} 訪談錄`, uri: '#' },
                { title: `[模擬] 重返 ${disasterName} 災區 - 十年後的記憶`, uri: '#' },
                { title: `[模擬] 救災英雄：${perspective} 的第一線紀錄`, uri: '#' },
            ]
        });
    }, 1500));
  }

  const prompt = `
    請以繁體中文，針對台灣的「${disasterName}」，搜尋並總結「${perspective}」視角的真實故事、新聞報導或訪談。
    你的總結應該要能讓人們對當時的情況有更深入的了解。
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        }
    });
    
    const summary = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const stories: RealStory[] = groundingChunks
      .map(chunk => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || '無標題來源'
      }))
      .filter(story => story.uri); // Filter out any non-web results or empty URIs

    // Deduplicate stories based on URI to avoid showing the same link multiple times
    const uniqueStories = Array.from(new Map(stories.map(item => [item.uri, item])).values());

    return { summary, stories: uniqueStories };
  } catch (error) {
    console.error("Error searching for real stories with Gemini API:", error);
    return {
        summary: "很抱歉，搜尋相關故事時發生錯誤。請稍後再試。",
        stories: []
    };
  }
};
