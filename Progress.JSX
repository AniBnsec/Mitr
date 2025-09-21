
import React, { useState, useEffect, useCallback } from 'react';
import { MoodLog } from '@/entities/MoodLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const moodStyles = {
  Ecstatic: { emoji: '😃', color: 'bg-green-400' },
  Happy: { emoji: '😊', color: 'bg-lime-400' },
  Neutral: { emoji: '😐', color: 'bg-yellow-400' },
  Sad: { emoji: '😔', color: 'bg-blue-400' },
  Angry: { emoji: '😠', color: 'bg-red-400' },
};

export default function ProgressPage() {
  const [userId, setUserId] = useState(null);
  const [moodLogs, setMoodLogs] = useState([]);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    let currentUserId = localStorage.getItem('mitr_anonymous_id');
    if (!currentUserId) {
      currentUserId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      localStorage.setItem('mitr_anonymous_id', currentUserId);
    }
    setUserId(currentUserId);
  }, []);

  const fetchMoodsForMonth = useCallback(async (date) => {
    if (!userId) return; // Prevent fetching if userId is not yet available
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const logs = await MoodLog.filter({
      user_id: userId,
      // This is a simplification; a real app might need more complex date filtering
    }, '-created_date', 100); 

    // Filter in frontend since backend doesn't support date range filters yet
    const monthLogs = logs.filter(log => {
      const logDate = new Date(log.log_date);
      // Ensure the log date is within the selected month's start and end, inclusive
      return logDate >= start && logDate <= end;
    });

    setMoodLogs(monthLogs);
  }, [userId]); // fetchMoodsForMonth depends on userId

  useEffect(() => {
    fetchMoodsForMonth(month);
  }, [fetchMoodsForMonth, month]); // The effect depends on the memoized function and the month state
  
  const getMoodForDay = (day) => {
    return moodLogs.find(log => isSameDay(new Date(log.log_date), day));
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Your Mood Journey
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Visualize your emotional patterns and progress over time.
          </p>
        </motion.div>

        <Card className="glass-effect gentle-shadow border-0">
          <CardContent className="p-4 md:p-6 flex justify-center">
            <Calendar
              month={month}
              onMonthChange={setMonth}
              modifiers={{
                ...Object.fromEntries(
                    moodLogs.map(log => [
                        moodStyles[log.mood]?.color.replace('bg-',''), 
                        new Date(log.log_date)
                    ])
                )
              }}
              modifiersClassNames={{
                ...Object.fromEntries(
                    Object.values(moodStyles).map(style => [
                        style.color.replace('bg-',''), 
                        `${style.color} text-white rounded-full`
                    ])
                )
              }}
              components={{
                Day: ({ date, ...props }) => {
                  const moodLog = getMoodForDay(date);
                  if (moodLog) {
                    return <div className="relative flex items-center justify-center h-full">
                       <span className={`${moodStyles[moodLog.mood]?.color} w-10 h-10 flex items-center justify-center rounded-full text-white`}>
                           {date.getDate()}
                       </span>
                    </div>;
                  }
                  return <div {...props} className="text-center p-2 rounded-full">{date.getDate()}</div>;
                },
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="glass-effect gentle-shadow border-0">
            <CardHeader><CardTitle>Mood Legend</CardTitle></CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {Object.entries(moodStyles).map(([mood, {emoji, color}]) => (
                        <div key={mood} className="flex items-center gap-2">
                           <div className={`w-5 h-5 rounded-full ${color}`}></div>
                           <span>{emoji} {mood}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
