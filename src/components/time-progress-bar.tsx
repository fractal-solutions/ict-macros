import { useState, useEffect } from 'react';
import { useTime } from '@/contexts/time-context';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface TimeProgressBarProps {
  label: string;
  date: string;
}

export function TimeProgressBar({ label, date }: TimeProgressBarProps) {
  const { currentTime, estTime } = useTime();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const calculateDayProgress = () => {
      const now = new Date(estTime);
      
      // Trading hours (9:30 AM - 4:00 PM EST)
      const tradingStart = 1 * 3600 + 50 * 60; // 1:50 AM in seconds
      const tradingEnd = 16 * 3600; // 4:00 PM in seconds
      const tradingDuration = tradingEnd - tradingStart;
      
      // Current time in seconds
      const currentSeconds =
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds();
      
      // Calculate progress within trading hours
      let percentage = 0;
      if (currentSeconds >= tradingStart && currentSeconds <= tradingEnd) {
        percentage = ((currentSeconds - tradingStart) / tradingDuration) * 100;
      } else if (currentSeconds > tradingEnd) {
        percentage = 100;
      }
      setProgress(percentage);
    };
    
    calculateDayProgress();
    const interval = setInterval(calculateDayProgress, 1000);
    
    return () => clearInterval(interval);
  }, [estTime]);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label}</span>
        <Card className="px-3 py-2">
          <div className="flex gap-4 items-center">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Local</div>
              <div className="font-medium">{currentTime.toLocaleDateString()}</div>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground">EST</div>
              <div className="font-medium">{estTime.toLocaleDateString()}</div>
            </div>
          </div>
        </Card>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between mt-2">
        <div className="flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-blue-500 mb-1"></div>
          <span className="text-xs font-medium text-blue-500">Pre</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-indigo-500 mb-1"></div>
          <span className="text-xs font-medium text-indigo-500">Dawn</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-amber-500 mb-1"></div>
          <span className="text-xs font-medium text-amber-500">Breakfast</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-orange-500 mb-1"></div>
          <span className="text-xs font-medium text-orange-500">Lunch</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mb-1"></div>
          <span className="text-xs font-medium text-green-500">Tea</span>
        </div>
      </div>
    </div>
  );
}