import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeWindow } from '@/components/time-window';
import { macrosData } from '@/lib/trading-data';
import { useTime } from '@/contexts/time-context';
import { getTimeWindowStatus } from '@/lib/time-utils';

export function MacrosPanel() {
  const { estTime, timezone } = useTime();
  
  return (
    <Card className="border-green-600/20">
      <CardHeader className="pb-3 bg-green-950/20">
        <CardTitle className="flex items-center text-green-400">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
          Macro Timings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {macrosData.map((macro) => {
            const status = getTimeWindowStatus(estTime, macro.startTime, macro.endTime);
            
            return (
              <TimeWindow
                key={macro.id}
                name={macro.name}
                startTime={macro.startTime}
                endTime={macro.endTime}
                status={status}
                color={macro.isSpecialEvent ? "red" : "green"}
                timezone={timezone}
                description={macro.description}
                relatedSession={macro.relatedSession}
                isSpecialEvent={macro.isSpecialEvent}
                macroNumber={macro.macroNumber}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}