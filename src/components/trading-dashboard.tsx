import { useState } from 'react';
import { useTime } from '@/contexts/time-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeOverview } from '@/components/time-overview';
import { SessionsPanel } from '@/components/sessions-panel';
import { KillzonesPanel } from '@/components/killzones-panel';
import { MacrosPanel } from '@/components/macros-panel';
import { TimeProgressBar } from '@/components/time-progress-bar';
import { formatDate } from '@/lib/time-utils';

export function TradingDashboard() {
  const { currentTime } = useTime();
  const [date, setDate] = useState(formatDate(currentTime));
  
  // Update the date when it changes
  useTime(time => {
    const newDate = formatDate(time);
    if (newDate !== date) {
      setDate(newDate);
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Current Trading Status</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeOverview />
          <TimeProgressBar label="Trading Day Progress" date={date} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6">
        <SessionsPanel />
        <KillzonesPanel />
        <MacrosPanel />
      </div>
    </div>
  );
}