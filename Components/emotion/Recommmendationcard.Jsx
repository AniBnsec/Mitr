
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Music, 
  PlayCircle, 
  BookOpen, 
  Smile, 
  Activity,
  Coffee,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const getIconForType = (type) => {
  const icons = {
    'video': PlayCircle,
    'music': Music,
    'article': BookOpen,
    'joke': Smile,
    'exercise': Activity,
    'quote': Heart,
    'activity': Coffee,
    'podcast': PlayCircle
  };
  return icons[type] || Sparkles;
};

const getColorForEmotion = (emotion) => {
  const colors = {
    'sad': 'from-blue-400 to-cyan-500',
    'happy': 'from-yellow-400 to-orange-500',
    'anxious': 'from-purple-400 to-pink-500',
    'stressed': 'from-red-400 to-pink-500',
    'excited': 'from-green-400 to-blue-500',
    'overwhelmed': 'from-indigo-400 to-purple-500',
    'lonely': 'from-pink-400 to-purple-500',
    'angry': 'from-red-500 to-orange-500',
    'confused': 'from-gray-400 to-blue-500',
    'grateful': 'from-emerald-400 to-teal-500'
  };
  return colors[emotion] || 'from-indigo-400 to-purple-500';
};

export default function RecommendationCard({ 
  primaryEmotion, 
  detectedEmotions, 
  recommendations,
  originalText 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Emotion Analysis Header */}
      <Card className="glass-effect gentle-shadow border-0">
        <CardHeader>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`w-16 h-16 bg-gradient-to-r ${getColorForEmotion(primaryEmotion)} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              I understand you're feeling {primaryEmotion}
            </CardTitle>
            <p className="text-gray-600">
              Your emotions are valid, and you're taking a positive step by expressing them. Here's what I've prepared especially for you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {detectedEmotions.map((emotion, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-white/40 text-gray-700 border border-white/20"
                >
                  {emotion}
                </Badge>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI-powered suggestions by</span>
              <span className="font-semibold text-gray-600">Google Gemini</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => {
          const IconComponent = getIconForType(rec.type);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className="glass-effect gentle-shadow border-0 h-full hover:scale-[1.02] transition-transform duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 bg-gradient-to-r ${getColorForEmotion(primaryEmotion)} rounded-xl`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-800 mb-1">
                        {rec.title}
                      </CardTitle>
                      <Badge 
                        variant="outline"
                        className="text-xs bg-white/40 border-white/20"
                      >
                        {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {rec.content}
                  </p>
                  
                  {rec.url && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-white/40 border-white/20 hover:bg-white/60 transition-all duration-300"
                    >
                      <a 
                        href={rec.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <span>Try This</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Encouragement Card */}
      <Card className="glass-effect gentle-shadow border-0">
        <CardContent className="text-center py-8">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Remember, this feeling is temporary
          </h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            You've taken a brave step by acknowledging your emotions. Healing and growth take time, 
            and it's okay to have difficult days. You are stronger than you know.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
