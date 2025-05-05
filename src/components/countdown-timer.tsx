import { useState, useEffect } from 'react';
import { useTime } from '@/contexts/time-context';
import { parseTimeToDate, formatDuration } from '@/lib/time-utils';
import { Progress } from '@/components/ui/progress';

interface CountdownTimerProps {
  startTime: string;
  endTime: string;
  status: 'active' | 'upcoming' | 'inactive';
}

export function CountdownTimer({ startTime, endTime, status }: CountdownTimerProps) {
  const { estTime } = useTime();
  const [timeText, setTimeText] = useState('');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date(estTime);
      
      // Create EST times by parsing the time strings in EST context
      const start = new Date(estTime);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      start.setHours(startHour, startMinute, 0, 0);
      
      const end = new Date(estTime);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      end.setHours(endHour, endMinute, 0, 0);
      
      // Handle overnight sessions
      const isOvernight = end < start;
      if (isOvernight) {
        // If current time is before midnight (still in first day)
        if (now < start) {
          end.setDate(end.getDate() + 1);
        }
        // If current time is after midnight (in second day)
        else {
          start.setDate(start.getDate() + 1);
          end.setDate(end.getDate() + 1);
        }
      }
      
      if (status === 'upcoming') {
        // Calculate time until start
        const timeUntilStart = start.getTime() - now.getTime();
        setTimeText(`Starts in: ${formatDuration(timeUntilStart)}`);
        
        // Calculate progress as percentage of time passed until start
        const totalTimeUntilStart = start.getTime() - (start.getTime() - 24 * 60 * 60 * 1000);
        const timePassedPercent = 100 - (timeUntilStart / totalTimeUntilStart) * 100;
        setProgress(Math.max(0, Math.min(100, timePassedPercent)));
      } else if (status === 'active') {
        // Calculate time remaining
        const timeRemaining = end.getTime() - now.getTime();
        setTimeText(`Remaining: ${formatDuration(timeRemaining)}`);
        
        // Calculate progress as percentage of time passed in session
        const totalSessionDuration = end.getTime() - start.getTime();
        const timePassedPercent = ((now.getTime() - start.getTime()) / totalSessionDuration) * 100;
        setProgress(Math.max(0, Math.min(100, timePassedPercent)));
      }
    };
    
    updateTimer();
    
    // Only set up interval if we're tracking an active or upcoming event
    if (status !== 'inactive') {
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [estTime, startTime, endTime, status]);
  
  if (status === 'inactive') return null;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{timeText}</span>
        <span>{progress.toFixed(0)}%</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}