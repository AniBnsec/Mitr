import React, { useState } from "react";
import { EmotionEntry } from "@/entities/EmotionEntry";
import { InvokeLLM } from "@/integrations/Core";

import EmotionInput from "/components/emotion/EmotionInput";
import RecommendationCard from "../components/emotion/RecommendationCard";

export default function MitrTalkPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);

  const handleEmotionSubmit = async (emotionText) => {
    setIsLoading(true);
    
    try {
      const emotionAnalysis = await InvokeLLM({
        prompt: `Analyze the following emotional expression from an Indian youth and provide empathetic, culturally sensitive support:

        "${emotionText}"

        Please analyze:
        1. Primary emotion (one word: sad, happy, anxious, stressed, excited, overwhelmed, lonely, angry, confused, grateful, etc.)
        2. Secondary emotions detected
        3. Intensity level (low, moderate, high)
        4. Generate 4-6 personalized recommendations that would help this person feel better, including:
           - Funny videos or content (YouTube links to popular Indian comedy channels)
           - Soothing music recommendations (Indian artists or Bollywood songs)
           - Mindfulness exercises or breathing techniques
           - Inspirational quotes or stories
           - Physical activities or hobbies
           - Articles or resources relevant to their situation

        Be culturally sensitive to Indian youth context, academic pressures, family dynamics, and social expectations. 
        Provide practical, accessible suggestions that can be implemented immediately.`,
        
        response_json_schema: {
          type: "object",
          properties: {
            primary_emotion: { type: "string" },
            detected_emotions: { type: "array", items: { type: "string" } },
            intensity_level: { type: "string", enum: ["low", "moderate", "high"] },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["video", "music", "exercise", "quote", "article", "activity", "joke", "podcast"] },
                  title: { type: "string" },
                  content: { type: "string" },
                  url: { type: "string" }
                }
              }
            }
          }
        }
      });

      const entryData = {
        emotion_text: emotionText,
        detected_emotions: emotionAnalysis.detected_emotions,
        primary_emotion: emotionAnalysis.primary_emotion,
        intensity_level: emotionAnalysis.intensity_level,
        recommendations: emotionAnalysis.recommendations,
        is_anonymous: true
      };

      await EmotionEntry.create(entryData);
      setCurrentRecommendation(emotionAnalysis);
      
    } catch (error) {
      console.error("Error processing emotion:", error);
      setCurrentRecommendation({
        primary_emotion: "supported",
        detected_emotions: ["cared for"],
        recommendations: [
          { type: "quote", title: "You're Not Alone", content: "Remember that seeking help is a sign of strength, not weakness. Your feelings are valid and there are people who care about you." },
          { type: "exercise", title: "Deep Breathing", content: "Try the 4-7-8 breathing technique: Breathe in for 4 seconds, hold for 7, exhale for 8. Repeat 3-4 times." }
        ]
      });
    }
    
    setIsLoading(false);
  };

  const handleStartOver = () => {
    setCurrentRecommendation(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {!currentRecommendation ? (
          <EmotionInput 
            onSubmit={handleEmotionSubmit}
            isLoading={isLoading}
          />
        ) : (
          <div className="space-y-8">
            <RecommendationCard
              primaryEmotion={currentRecommendation.primary_emotion}
              detected_emotions={currentRecommendation.detected_emotions}
              recommendations={currentRecommendation.recommendations}
            />
            
            <div className="text-center">
              <button
                onClick={handleStartOver}
                className="px-8 py-3 bg-white/40 hover:bg-white/60 border border-white/20 rounded-full text-gray-700 font-medium transition-all duration-300 gentle-shadow"
              >
                Express Another Feeling
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}