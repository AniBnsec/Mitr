import React, { useState, useEffect, useCallback } from 'react';
import { MoodLog } from '@/entities/MoodLog';
import { InvokeLLM } from '@/integrations/Core';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { format, isToday } from 'date-fns';
import { Sparkles, Edit, BookOpen, BarChart3, Heart, ExternalLink } from 'lucide-react';

const moods = [
  { name: 'Ecstatic', emoji: '😃' },
  { name: 'Happy', emoji: '😊' },
  { name: 'Neutral', emoji: '😐' },
  { name: 'Sad', emoji: '😔' },
  { name: 'Angry', emoji: '😠' },
];

const FeatureCard = ({ title, description, icon: Icon, url, color }) => (
  <motion.div whileHover={{ y: -5 }} className="h-full">
    <Link to={url} className="block h-full">
      <Card className="glass-effect gentle-shadow border-0 h-full flex flex-col justify-between hover:bg-white/40 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

export default function DashboardPage() {
  const [userId, setUserId] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [moodSuggestions, setMoodSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    let currentUserId = localStorage.getItem('mitr_anonymous_id');
    if (!currentUserId) {
      currentUserId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      localStorage.setItem('mitr_anonymous_id', currentUserId);
    }
    setUserId(currentUserId);
  }, []);

  const fetchTodayMood = useCallback(async () => {
    if (userId) {
      setIsLoading(true);
      const moodLogs = await MoodLog.filter({ user_id: userId }, '-created_date', 1);
      const latestLog = moodLogs[0];
      if (latestLog && isToday(new Date(latestLog.log_date))) {
        setTodayMood(latestLog.mood);
        // Get suggestions for existing mood
        generateMoodSuggestions(latestLog.mood);
      }
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTodayMood();
  }, [fetchTodayMood]);

  const generateMoodSuggestions = async (mood) => {
    setLoadingSuggestions(true);
    try {
      const result = await InvokeLLM({
        prompt: `An Indian youth is feeling ${mood} today. Based on this mood, provide 3-4 helpful, culturally sensitive suggestions to support their mental wellness. Consider Indian context like family dynamics, academic pressure, and social expectations.

        For each suggestion, provide:
        - A specific activity, resource, or tip
        - Brief explanation of why it would help
        - If applicable, include relevant links to Indian content (Bollywood songs, Indian meditation apps, local resources, etc.)

        Make the suggestions practical and immediately actionable.`,
        
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  action: { type: "string" },
                  url: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setMoodSuggestions(result.suggestions || []);
    } catch (error) {
      console.error('Error generating mood suggestions:', error);
      setMoodSuggestions([
        {
          title: "Deep Breathing",
          description: "Take a few moments to center yourself with breathing exercises.",
          action: "Try the 4-7-8 technique: breathe in for 4, hold for 7, exhale for 8."
        }
      ]);
    }
    setLoadingSuggestions(false);
  };

  const handleMoodSelect = async (moodName) => {
    if (!userId) return;
    setTodayMood(moodName);
    await MoodLog.create({
      mood: moodName,
      log_date: new Date().toISOString().split('T')[0],
      user_id: userId,
    });
    
    // Generate suggestions based on selected mood
    generateMoodSuggestions(moodName);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
          <p className="text-lg text-gray-600 mt-2">Your safe space for emotional well-being.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="glass-effect gentle-shadow border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold text-gray-800">Daily Mood Check-in</CardTitle>
              <p className="text-sm text-gray-600">How are you feeling today?</p>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-2">
                <Sparkles className="w-3 h-3" />
                <span>Suggestions powered by</span>
                <span className="font-semibold text-gray-600">Google Gemini</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {todayMood ? (
                 <div className="text-center space-y-4">
                    <p className="text-4xl">{moods.find(m => m.name === todayMood)?.emoji}</p>
                    <p className="text-lg text-gray-700">You're feeling <strong>{todayMood}</strong> today.</p>
                 </div>
              ) : (
                <div className="flex justify-around items-center">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.name}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMoodSelect(mood.name)}
                      className="text-center space-y-2 group"
                    >
                      <div className="text-5xl transition-transform duration-200 group-hover:scale-110">{mood.emoji}</div>
                      <p className="text-sm text-gray-600 font-medium">{mood.name}</p>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Mood-based Suggestions */}
              {todayMood && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    Personalized Suggestions for You
                  </h3>
                  
                  {loadingSuggestions ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Getting personalized suggestions...</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {moodSuggestions?.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="glass-effect border-0 h-full">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-pink-500" />
                                {suggestion.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                              {suggestion.action && (
                                <p className="text-xs text-gray-500 italic">{suggestion.action}</p>
                              )}
                              {suggestion.url && (
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="mt-3 w-full"
                                >
                                  <a href={suggestion.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <span>Try This</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           <FeatureCard 
             title="Talk to Mitr"
             description="Share your feelings with an empathetic AI companion."
             icon={Sparkles}
             url={createPageUrl("MitrTalk")}
             color="bg-gradient-to-r from-indigo-500 to-purple-600"
           />
           <FeatureCard 
             title="Guided Journal"
             description="Explore your thoughts with AI-generated prompts."
             icon={Edit}
             url={createPageUrl("GuidedJournal")}
             color="bg-gradient-to-r from-green-500 to-emerald-600"
           />
           <FeatureCard 
             title="My Progress"
             description="Visualize your mood journey over time."
             icon={BarChart3}
             url={createPageUrl("Progress")}
             color="bg-gradient-to-r from-blue-500 to-cyan-600"
           />
           <FeatureCard 
             title="Wellness Hub"
             description="Find articles, helplines, and self-care tips."
             icon={BookOpen}
             url={createPageUrl("Resources")}
             color="bg-gradient-to-r from-rose-500 to-pink-600"
           />
        </div>
      </div>
    </div>
  );
}