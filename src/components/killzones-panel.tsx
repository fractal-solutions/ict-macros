import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeWindow } from '@/components/time-window';
import { killzonesData } from '@/lib/trading-data';
import { useTime } from '@/contexts/time-context';
import { getTimeWindowStatus } from '@/lib/time-utils';

export function KillzonesPanel() {
  const { estTime, timezone } = useTime();
  
  return (
    <Card className="border-orange-600/20">
      <CardHeader className="pb-3 bg-orange-950/20">
        <CardTitle className="flex items-center text-orange-400">
          <div className="h-3 w-3 rounded-full bg-orange-500 mr-2 animate-pulse"></div>
          Killzones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {killzonesData.map((killzone) => {
            const status = getTimeWindowStatus(estTime, killzone.startTime, killzone.endTime);
            
            return (
              <TimeWindow
                key={killzone.id}
                name={killzone.name}
                startTime={killzone.startTime}
                endTime={killzone.endTime}
                status={status}
                color="orange"
                timezone={timezone}
                description={killzone.description}
                relatedSession={killzone.relatedSession}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}