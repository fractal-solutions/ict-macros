import { ThemeProvider } from '@/components/theme-provider';
import { TimeProvider } from '@/contexts/time-context';
import TradeLayout from '@/components/trade-layout';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

function App() {
  const { toast } = useToast();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      toast({
        title: "Dashboard Initialized",
        description: "Real-time trading schedule tracking is now active.",
      });
      setLoaded(true);
    }
  }, [loaded, toast]);

  return (
    <ThemeProvider defaultTheme="dark">
      <TimeProvider>
        <div className="min-h-screen bg-background px-8 md:pl-32 lg:pl-30 xl:pl-32 2xl:pl-72">
          <TradeLayout />
          <Toaster />
        </div>
      </TimeProvider>
    </ThemeProvider>
  );
}

export default App;