import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { currentTimezone } from '@/lib/time-utils';

interface TimeContextType {
  currentTime: Date;
  estTime: Date;
  timezone: string;
  setTimezone: (timezone: string) => void;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

interface TimeProviderProps {
  children: ReactNode;
  timezone?: string;
}

export function TimeProvider({ children }: TimeProviderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone, setTimezone] = useState(currentTimezone());
  
  // Convert local time to EST/EDT (UTC-5/-4 depending on DST)
  const getEstTime = (date: Date) => {
    // Use Intl.DateTimeFormat to get accurate EST/EDT time
    const estFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    
    const parts = estFormatter.formatToParts(date);
    const estDate = new Date(
      parseInt(parts.find(p => p.type === 'year')?.value || '0'),
      parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1,
      parseInt(parts.find(p => p.type === 'day')?.value || '0'),
      parseInt(parts.find(p => p.type === 'hour')?.value || '0'),
      parseInt(parts.find(p => p.type === 'minute')?.value || '0'),
      parseInt(parts.find(p => p.type === 'second')?.value || '0')
    );
    
    return estDate;
  };
  
  const [estTime, setEstTime] = useState(getEstTime(new Date()));

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setEstTime(getEstTime(now));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update current time immediately when timezone changes
    const now = new Date();
    setCurrentTime(now);
  }, [timezone]);
  
  return (
    <TimeContext.Provider value={{ currentTime, timezone, estTime, setTimezone }}>
      {children}
    </TimeContext.Provider>
  );
}

export function useTime(callback?: (time: Date, estTime: Date) => void) {
  const context = useContext(TimeContext);
  
  if (context === undefined) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  
  useEffect(() => {
    if (callback) {
      // Call immediately
      callback(context.currentTime, context.estTime);
      
      // Set up interval to call every second
      const interval = setInterval(() => {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        const estTime = new Date(utcTime - (5 * 60 * 60 * 1000));
        callback(now, estTime);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [callback]);
  
  return context;
}