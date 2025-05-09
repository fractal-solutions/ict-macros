import { useEffect, useState } from 'react';
import { useTime } from '@/contexts/time-context';
import { 
  findActiveSession, 
  findActiveKillzone, 
  findActiveMacro,
  formatTimeWithSeconds,
  getTimeWindowStatus,
  formatShortDuration
} from '@/lib/time-utils';
import { sessionsData, killzonesData, macrosData } from '@/lib/trading-data';
import { Badge } from '@/components/ui/badge';

export function TimeOverview() {
  const { currentTime, estTime, timezone } = useTime();
  const [localTimeString, setLocalTimeString] = useState('');
  const [estTimeString, setEstTimeString] = useState('');
  const [activeSessions, setActiveSessions] = useState<Array<{name: string, endTime: string}>>([]);
  const [activeKillzones, setActiveKillzones] = useState<Array<{name: string, endTime: string}>>([]);
  const [activeMacros, setActiveMacros] = useState<Array<{name: string, endTime: string}>>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<string[]>([]);
  const [upcomingKillzones, setUpcomingKillzones] = useState<string[]>([]);
  const [upcomingMacros, setUpcomingMacros] = useState<string[]>([]);

  useEffect(() => {
    const updateStatuses = () => {
      //console.log('Current EST time:', estTime.toISOString());
      
      // Update all the active and upcoming statuses using EST time
      const activeSessions = sessionsData
        .filter(session => getTimeWindowStatus(estTime, session.startTime, session.endTime, 'America/New_York') === 'active')
        .map(s => ({ name: s.name, endTime: s.endTime }));
      
      const activeKillzones = killzonesData
        .filter(killzone => getTimeWindowStatus(estTime, killzone.startTime, killzone.endTime, 'America/New_York') === 'active')
        .map(k => ({ name: k.name, endTime: k.endTime }));
      
      const activeMacros = macrosData
        .filter(macro => getTimeWindowStatus(estTime, macro.startTime, macro.endTime, 'America/New_York') === 'active')
        .map(m => ({ name: m.name, endTime: m.endTime }));
      
      const upcomingSessions = sessionsData
        .filter(session => getTimeWindowStatus(estTime, session.startTime, session.endTime, 'America/New_York') === 'upcoming')
        .map(s => s.name);
      
      const upcomingKillzones = killzonesData
        .filter(killzone => getTimeWindowStatus(estTime, killzone.startTime, killzone.endTime, 'America/New_York') === 'upcoming')
        .map(k => k.name);
      
      const upcomingMacros = macrosData
        .filter(macro => getTimeWindowStatus(estTime, macro.startTime, macro.endTime, 'America/New_York') === 'upcoming')
        .map(m => m.name);
      
      setActiveSessions(activeSessions);
      setActiveKillzones(activeKillzones);
      setActiveMacros(activeMacros);
      setUpcomingSessions(upcomingSessions);
      setUpcomingKillzones(upcomingKillzones);
      setUpcomingMacros(upcomingMacros);
      
      // Format both local and EST times
      setLocalTimeString(formatTimeWithSeconds(currentTime, timezone));
      setEstTimeString(formatTimeWithSeconds(estTime, 'America/New_York'));
    };

    updateStatuses();
    
    // Check more frequently if there are upcoming events
    const hasUpcomingEvents = upcomingSessions.length > 0 ||
                            upcomingKillzones.length > 0 ||
                            upcomingMacros.length > 0;
    
    const interval = setInterval(updateStatuses, hasUpcomingEvents ? 1000 : 5000);
    return () => clearInterval(interval);
  }, [currentTime, estTime, timezone]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
        <div className="text-3xl font-bold tracking-tighter">
          {localTimeString}
        </div>
        <div className="text-sm text-muted-foreground">
          Local: {timezone}
        </div>
        <div className="text-2xl font-semibold tracking-tight mt-2">
          {estTimeString}
        </div>
        <div className="text-xs text-muted-foreground">
          Market: EST/EDT
        </div>
      </div>
      
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-3">
        <div className="flex flex-col items-center justify-center bg-blue-950/10 rounded-lg p-4 border border-blue-900/30 hover:bg-blue-950/20 transition-colors">
          <p className="text-xs font-medium text-blue-400 mb-2">TRADING SESSIONS</p>
          <div className="flex flex-wrap gap-2 justify-center min-h-[40px] items-center">
            {activeSessions.length > 0 ? (
              activeSessions.map(session => (
                <Badge
                  key={session.name}
                  className="relative bg-blue-900/80 hover:bg-blue-800 text-blue-100 border-blue-700 pr-6"
                >
                  {session.name}
                  <Badge className="absolute -right-3 -top-1 -m-0.5 px-0.5 py-0 text-[9px] bg-white border-white animate-pulse">
                    {formatShortDuration(
                      new Date(
                        `${estTime.getFullYear()}-${estTime.getMonth()+1}-${estTime.getDate()} ${session.endTime}:00`
                      ).getTime() - estTime.getTime()
                    )}
                  </Badge>
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                No Active Sessions
              </Badge>
            )}
          </div>
          {upcomingSessions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-900/20">
              <p className="text-xs text-blue-400/80 mb-1">Upcoming:</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {upcomingSessions.map(session => (
                  <Badge
                    key={`upcoming-${session}`}
                    variant="outline"
                    className="text-blue-400 border-blue-400/50 hover:bg-blue-900/20"
                  >
                    {session}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center bg-orange-950/10 rounded-lg p-4 border border-orange-900/30 hover:bg-orange-950/20 transition-colors">
          <p className="text-xs font-medium text-orange-400 mb-2">KILL ZONES</p>
          <div className="flex flex-wrap gap-2 justify-center min-h-[40px] items-center">
            {activeKillzones.length > 0 ? (
              activeKillzones.map(killzone => (
                <Badge
                  key={killzone.name}
                  className="relative bg-orange-900/80 hover:bg-orange-800 text-orange-100 border-orange-700 pr-6"
                >
                  {killzone.name}
                  <Badge className="absolute -right-3 -top-1 -m-0.5 px-0.5 py-0 text-[9px] bg-white border-white animate-pulse">
                    {formatShortDuration(
                      new Date(
                        `${estTime.getFullYear()}-${estTime.getMonth()+1}-${estTime.getDate()} ${killzone.endTime}:00`
                      ).getTime() - estTime.getTime()
                    )}
                  </Badge>
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                No Active Zones
              </Badge>
            )}
          </div>
          {upcomingKillzones.length > 0 && (
            <div className="mt-2 pt-2 border-t border-orange-900/20">
              <p className="text-xs text-orange-400/80 mb-1">Upcoming:</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {upcomingKillzones.map(killzone => (
                  <Badge
                    key={`upcoming-${killzone}`}
                    variant="outline"
                    className="text-orange-400 border-orange-400/50 hover:bg-orange-900/20"
                  >
                    {killzone}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center bg-green-950/10 rounded-lg p-4 border border-green-900/30 hover:bg-green-950/20 transition-colors">
          <p className="text-xs font-medium text-green-400 mb-2">MACROS</p>
          <div className="flex flex-wrap gap-2 justify-center min-h-[40px] items-center">
            {activeMacros.length > 0 ? (
              activeMacros.map(macro => (
                <Badge
                  key={macro.name}
                  className="relative bg-green-900/80 hover:bg-green-800 text-green-100 border-green-700 pr-6"
                >
                  {macro.name}
                  <Badge className="absolute -right-3 -top-1 -m-0.5 px-0.5 py-0 text-[9px] bg-white border-white animate-pulse">
                    {formatShortDuration(
                      new Date(
                        `${estTime.getFullYear()}-${estTime.getMonth()+1}-${estTime.getDate()} ${macro.endTime}:00`
                      ).getTime() - estTime.getTime()
                    )}
                  </Badge>
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                No Active Macro
              </Badge>
            )}
          </div>
          {upcomingMacros.length > 0 && (
            <div className="mt-2 pt-2 border-t border-green-900/20">
              <p className="text-xs text-green-400/80 mb-1">Upcoming:</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {upcomingMacros.map(macro => (
                  <Badge
                    key={`upcoming-${macro}`}
                    variant="outline"
                    className="text-green-400 border-green-400/50 hover:bg-green-900/20"
                  >
                    {macro}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
