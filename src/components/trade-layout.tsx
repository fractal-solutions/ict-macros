import { useState, useEffect } from 'react';
import { TradingDashboard } from '@/components/trading-dashboard';
import { Header } from '@/components/header';
import { useTime } from '@/contexts/time-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SessionsPanel } from '@/components/sessions-panel';
import { KillzonesPanel } from '@/components/killzones-panel';
import { MacrosPanel } from '@/components/macros-panel';

export default function TradeLayout() {
  const { timezone: contextTimezone, setTimezone } = useTime();
  const [timezone, setLocalTimezone] = useState(contextTimezone);

  useEffect(() => {
    setLocalTimezone(contextTimezone);
  }, [contextTimezone]);

  const handleTimezoneChange = (tz: string) => {
    setTimezone(tz);
    setLocalTimezone(tz);
  };
  const [view, setView] = useState<'all' | 'sessions' | 'killzones' | 'macros'>('all');

  useEffect(() => {
    // Update page title
    document.title = 'Trading Schedule Dashboard';
  }, []);

  return (
      <div className="flex flex-col min-h-screen w-full">
        <Header 
          timezone={timezone} 
          onTimezoneChange={setTimezone}
        />
        
        <main className="flex-1 max-w-7xl mx-auto px-0 md:px-0 lg:px-24 py-6 w-full">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Trading Schedule</h1>
              <p className="text-muted-foreground">
                Track real-time market sessions, killzones and macro timing windows
              </p>
            </div>
            
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={(v) => setView(v as any)}>
              <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="killzones">Killzones</TabsTrigger>
                <TabsTrigger value="macros">Macros</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {view === 'all' ? (
            <TradingDashboard />
          ) : (
            <div className="space-y-4">
              {view === 'sessions' && <SessionsPanel />}
              {view === 'killzones' && <KillzonesPanel />}
              {view === 'macros' && <MacrosPanel />}
            </div>
          )}
        </main>
      </div>
  );
}