import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeWindow } from '@/components/time-window';
import { sessionsData } from '@/lib/trading-data';
import { useTime } from '@/contexts/time-context';
import { getTimeWindowStatus } from '@/lib/time-utils';

export function SessionsPanel() {
  const { timezone, estTime } = useTime();
  
  return (
    <Card className="border-blue-600/20">
      <CardHeader className="pb-3 bg-blue-950/20">
        <CardTitle className="flex items-center text-blue-400">
          <div className="h-3 w-3 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
          Trading Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {sessionsData.map((session) => {
            const status = getTimeWindowStatus(estTime, session.startTime, session.endTime);
            
            return (
              <TimeWindow
                key={session.id}
                name={session.name}
                startTime={session.startTime}
                endTime={session.endTime}
                status={status}
                color="blue"
                timezone="America/New_York"
                description={session.description}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}