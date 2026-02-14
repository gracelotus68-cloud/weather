
import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchWeatherAnalysis = async (lat: number, lng: number, city?: string): Promise<WeatherData> => {
  const model = 'gemini-3-flash-preview';
  
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + kstOffset);
  const timeString = kstTime.toLocaleString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    weekday: 'long' 
  });

  const locationPrompt = city 
    ? `현재 ${city}의 상세 날씨 정보를 알려줘.`
    : `현재 위도 ${lat}, 경도 ${lng} 위치의 상세 날씨 정보를 알려줘.`;

  const fullPrompt = `기준 시간: ${timeString} (한국 표준시)
  위 기준 시간을 바탕으로 ${locationPrompt}
  
  다음 항목들을 포함해서 상큼하고 발랄한 말투로 설명해줘:
  1. 현재 온도와 느껴지는 체감 온도
  2. 현재 하늘 상태 (맑음, 흐림, 비 등)
  3. 습도와 풍속 정보
  4. 오늘 하루의 대략적인 기온 변화 예보
  5. 오늘의 날씨에 딱 맞는 옷차림 추천
  6. 오늘 하기 좋은 야외 또는 실내 활동 추천
  7. 미세먼지나 자외선 등 주의사항
  
  중요: 반드시 현재 한국 시간(${timeString})을 기준으로 최신 정보를 검색해서 답변해줘. 모든 답변은 한국어로 해줘.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "날씨 정보를 가져오는 데 실패했습니다.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      }));

    return {
      location: city || "나의 위치",
      temperature: "--", 
      condition: "분석 완료",
      humidity: "--",
      windSpeed: "--",
      forecast: text,
      recommendations: {
        clothing: "",
        activities: "",
        precautions: ""
      },
      sources: sources
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
