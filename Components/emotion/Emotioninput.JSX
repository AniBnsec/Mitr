
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Send, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function EmotionInput({ onSubmit, isLoading }) {
  const [emotionText, setEmotionText] = useState('');

  const handleSubmit = () => {
    if (emotionText.trim()) {
      onSubmit(emotionText.trim());
    }
  };

  const quickPrompts = [
    "I'm feeling overwhelmed with studies...",
    "I had a great day today because...",
    "I'm worried about my future and...",
    "I feel disconnected from my friends...",
    "Something amazing happened and I want to share..."
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="glass-effect gentle-shadow border-0">
        <CardHeader className="text-center pb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            How are you feeling today?
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Share your thoughts in a safe, judgment-free space. Our AI companion will understand and provide personalized support.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Completely anonymous and confidential</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Textarea
              value={emotionText}
              onChange={(e) => setEmotionText(e.target.value)}
              placeholder="Express yourself freely... Share what's on your mind, how your day went, or anything that's bothering you. There's no right or wrong way to feel."
              className="min-h-[150px] text-base leading-relaxed border-0 bg-white/50 focus:bg-white/80 resize-none transition-all duration-300"
              disabled={isLoading}
            />
            
            <div className="text-right text-xs text-gray-400">
              {emotionText.length}/2000 characters
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Need inspiration? Try one of these:</p>
            <div className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEmotionText(prompt)}
                  className="w-full text-left p-3 bg-white/30 hover:bg-white/50 rounded-xl transition-all duration-300 text-sm text-gray-700 border border-white/20"
                  disabled={isLoading}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={!emotionText.trim() || isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-6 rounded-xl font-medium text-base gentle-shadow transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Understanding your emotions...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Get Personalized Support
                  <Send className="w-4 h-4" />
                </div>
              )}
            </Button>
          </motion.div>
          <div className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
            <span>AI powered by</span>
            <span className="font-semibold text-gray-600">Google Gemini</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
