import { useState } from 'react';
import { Clock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/countdown-timer';
import { formatShortDuration, formatTimeRange } from '@/lib/time-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TimeWindowStatus = 'active' | 'upcoming' | 'inactive';
type TimeWindowColor = 'blue' | 'orange' | 'green' | 'red';

interface TimeWindowProps {
  name: string;
  startTime: string;
  endTime: string;
  status: TimeWindowStatus;
  color: TimeWindowColor;
  timezone: string;
  description?: string;
  relatedSession?: string;
  isSpecialEvent?: boolean;
  macroNumber?: number;
}

export function TimeWindow({
  name,
  startTime,
  endTime,
  status,
  color,
  timezone,
  description,
  relatedSession,
  isSpecialEvent,
  macroNumber,
}: TimeWindowProps) {
  const [expanded, setExpanded] = useState(false);
  
  const colorClasses = {
    blue: {
      active: 'bg-blue-950/30 border-l-4 border-blue-500',
      upcoming: 'hover:bg-blue-950/10 border-l-4 border-blue-500/40',
      inactive: 'hover:bg-blue-950/5 border-l-4 border-transparent',
      badge: {
        active: 'bg-blue-500 text-primary-foreground',
        upcoming: 'bg-blue-500/20 text-blue-300',
        inactive: 'bg-muted text-muted-foreground',
      }
    },
    orange: {
      active: 'bg-orange-950/30 border-l-4 border-orange-500',
      upcoming: 'hover:bg-orange-950/10 border-l-4 border-orange-500/40',
      inactive: 'hover:bg-orange-950/5 border-l-4 border-transparent',
      badge: {
        active: 'bg-orange-500 text-primary-foreground',
        upcoming: 'bg-orange-500/20 text-orange-300',
        inactive: 'bg-muted text-muted-foreground',
      }
    },
    green: {
      active: 'bg-green-950/30 border-l-4 border-green-500',
      upcoming: 'hover:bg-green-950/10 border-l-4 border-green-500/40',
      inactive: 'hover:bg-green-950/5 border-l-4 border-transparent',
      badge: {
        active: 'bg-green-500 text-primary-foreground',
        upcoming: 'bg-green-500/20 text-green-300',
        inactive: 'bg-muted text-muted-foreground',
      }
    },
    red: {
      active: 'bg-red-950/30 border-l-4 border-red-500',
      upcoming: 'hover:bg-red-950/10 border-l-4 border-red-500/40',
      inactive: 'hover:bg-red-950/5 border-l-4 border-transparent',
      badge: {
        active: 'bg-red-500 text-primary-foreground',
        upcoming: 'bg-red-500/20 text-red-300',
        inactive: 'bg-muted text-muted-foreground',
      }
    },
  };

  const timeRange = formatTimeRange(startTime, endTime, timezone);

  return (
    <div 
      className={`p-4 cursor-pointer transition-all duration-200 ${colorClasses[color][status]}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-medium">
            {macroNumber && <span className="text-xs font-bold mr-1 opacity-70">#{macroNumber}</span>}
            {name}
          </div>
          {isSpecialEvent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="bg-red-500/30 text-red-200 text-xs">Special</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Important market event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={colorClasses[color].badge[status]}>
            {status === 'active' ? (
              <>
                Active
              </>
            ) : status === 'upcoming' ? 'Upcoming' : 'Inactive'}
          </Badge>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{timeRange}</span>
          </div>
        </div>
      </div>
      
      {status !== 'inactive' && (
        <div className="mt-2">
          <CountdownTimer
            startTime={startTime}
            endTime={endTime}
            status={status}
          />
        </div>
      )}
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50 text-sm text-muted-foreground">
          {description && (
            <div className="flex items-start gap-2 mb-2">
              <Info className="h-4 w-4 mt-0.5" />
              <p>{description}</p>
            </div>
          )}
          
          {relatedSession && (
            <div className="flex items-center">
              <Badge variant="outline" className="text-xs">
                Related: {relatedSession}
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}