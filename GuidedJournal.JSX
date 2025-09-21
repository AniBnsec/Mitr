
import React, { useState, useEffect, useCallback } from 'react';
import { InvokeLLM } from '@/integrations/Core';
import { JournalEntry } from '@/entities/JournalEntry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Save, Edit, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function GuidedJournalPage() {
  const [userId, setUserId] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState([]);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [view, setView] = useState('new'); // 'new' or 'list'

  useEffect(() => {
    let currentUserId = localStorage.getItem('mitr_anonymous_id');
    if (!currentUserId) {
      currentUserId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      localStorage.setItem('mitr_anonymous_id', currentUserId);
    }
    setUserId(currentUserId);
  }, []);

  const fetchEntries = useCallback(async () => {
    if (userId) {
      const userEntries = await JournalEntry.filter({ user_id: userId }, '-created_date');
      setEntries(userEntries);
    }
  }, [userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const getNewPrompt = async () => {
    setIsLoadingPrompt(true);
    setPrompt('');
    try {
      const result = await InvokeLLM({
        prompt: `Generate a single, short, and insightful journal prompt for an Indian youth dealing with stress, self-discovery, or daily life. The prompt should be open-ended and encouraging. Examples: "What is one small victory you had today, and how did it make you feel?", "Describe a challenge you're facing and one possible step you could take to address it.", "If you could give your younger self one piece of advice, what would it be and why?"`,
      });
      setPrompt(result.trim());
    } catch (error) {
      console.error('Error fetching prompt:', error);
      setPrompt("What's on your mind today? Write freely about anything you're feeling.");
    }
    setIsLoadingPrompt(false);
  };

  const handleSave = async () => {
    if (!content.trim() || !userId) return;
    setIsSaving(true);
    await JournalEntry.create({
      prompt: prompt,
      content: content,
      user_id: userId,
    });
    setContent('');
    setPrompt('');
    setIsSaving(false);
    await fetchEntries();
    setView('list');
  };

  const startNewEntry = () => {
    setContent('');
    setPrompt('');
    setView('new');
    getNewPrompt();
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Guided Journal
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A private space to explore your thoughts with AI-powered guidance.
          </p>
        </motion.div>

        <div className="flex justify-center gap-4">
            <Button onClick={startNewEntry} variant={view === 'new' ? 'default' : 'outline'} className={view === 'new' ? 'bg-green-600 hover:bg-green-700' : ''}>New Entry</Button>
            <Button onClick={() => setView('list')} variant={view === 'list' ? 'default' : 'outline'} className={view === 'list' ? 'bg-green-600 hover:bg-green-700' : ''}>Past Entries</Button>
        </div>

        <AnimatePresence mode="wait">
        {view === 'new' ? (
          <motion.div key="new-entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="glass-effect gentle-shadow border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">New Journal Entry</CardTitle>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>Prompts by</span>
                        <span className="font-semibold text-gray-600">Google Gemini</span>
                    </div>
                </div>
                 <Button onClick={getNewPrompt} disabled={isLoadingPrompt} variant="link" className="p-0 h-auto text-green-600 justify-start">
                    <Sparkles className="w-4 h-4 mr-2"/>
                    {isLoadingPrompt ? "Getting new prompt..." : "Get another prompt"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingPrompt && !prompt && <div className="text-center p-8">Loading a thoughtful prompt for you...</div>}
                
                {prompt && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                     <p className="text-lg font-semibold text-gray-700 p-4 bg-white/30 rounded-lg">{prompt}</p>
                  </motion.div>
                )}
                
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing here..."
                  className="min-h-[250px] text-base border-0 bg-white/50 focus:bg-white/80"
                  disabled={isSaving}
                />
                <Button onClick={handleSave} disabled={isSaving || !content.trim()} className="w-full bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2"/>
                  {isSaving ? "Saving..." : "Save Entry"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="entry-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {entries.length > 0 ? entries.map(entry => (
              <Card key={entry.id} className="glass-effect gentle-shadow border-0">
                <CardHeader>
                   <CardTitle className="text-lg">{entry.prompt || "Freewriting"}</CardTitle>
                   <p className="text-sm text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4"/>{format(new Date(entry.created_date), "MMMM d, yyyy 'at' h:mm a")}</p>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                </CardContent>
              </Card>
            )) : <p className="text-center text-gray-500 py-8">You have no journal entries yet. Start by creating a new one!</p>}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
