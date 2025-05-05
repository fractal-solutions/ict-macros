import { useState } from 'react';
import { Clock, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatCurrentTime } from '@/lib/time-utils';
import { useTime } from '@/contexts/time-context';
import { timezoneOptions } from '@/lib/timezone-data';

interface HeaderProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export function Header({ timezone, onTimezoneChange }: HeaderProps) {
  const { currentTime } = useTime();
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState(formatCurrentTime(currentTime, timezone));

  // Update the formatted time every second
  useTime(time => {
    setCurrentTimeFormatted(formatCurrentTime(time, timezone));
  });

  return (
    <header className="sticky top-0 w-full z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl -mx-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">Nexus</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center rounded-md bg-muted px-4 py-1.5">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">{currentTimeFormatted}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                <span>{timezone}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                {timezoneOptions.map((tz) => (
                  <DropdownMenuItem 
                    key={tz.value}
                    onClick={() => onTimezoneChange(tz.value)}
                    className={timezone === tz.value ? "bg-accent text-accent-foreground" : ""}
                  >
                    {tz.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}