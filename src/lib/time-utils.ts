import { sessionsData, killzonesData, macrosData } from './trading-data';
import { timezoneOptions } from './timezone-data';

// Helper to parse time strings like "08:00" to a Date object on the current day
export function parseTimeToDate(timeStr: string): Date {
  const now = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const date = new Date(now);
  date.setHours(hours, minutes, 0, 0);
  
  // If the time is in the past today, set it to tomorrow
  if (date < now && (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes))) {
    date.setDate(date.getDate() + 1);
  }
  
  return date;
}

// Convert EST/EDT time to target timezone
function convertTime(time: string, timezone: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const tzData = timezoneOptions.find(tz => tz.value === timezone);
  
  if (!tzData) return time;
  
  let adjustedHours = hours + tzData.offset;
  
  // Handle day wraparound
  if (adjustedHours >= 24) {
    adjustedHours -= 24;
  } else if (adjustedHours < 0) {
    adjustedHours += 24;
  }
  
  return `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Format time for display (different timezones)
export function formatTime(time: string, timezone: string): string {
  const convertedTime = convertTime(time, timezone);
  const [hours, minutes] = convertedTime.split(':').map(Number);
  
  // Create a date object with the specified time
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatTimeWithSeconds(date: Date, timezone: string): string {
  const tzDate = new Date(date);
  const tzData = timezoneOptions.find(tz => tz.value === timezone);
  
  if (tzData) {
    tzDate.setHours(date.getHours() + tzData.offset);
  }
  
  return tzDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// Format a time range for display
export function formatTimeRange(startTime: string, endTime: string, timezone: string): string {
  const formattedStart = formatTime(startTime, timezone);
  const formattedEnd = formatTime(endTime, timezone);
  
  return `${formattedStart} - ${formattedEnd}`;
}

// Format current date
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format current time in the specified timezone
export function formatCurrentTime(date: Date, timezone: string): string {
  const tzDate = new Date(date);
  const tzData = timezoneOptions.find(tz => tz.value === timezone);
  
  if (tzData) {
    tzDate.setHours(date.getHours() + tzData.offset);
  }
  
  return tzDate.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Helper to get the current timezone
export function currentTimezone(): string {
  // Try to get from browser first
  if (typeof Intl !== 'undefined') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  // Fallback to system environment (Node.js)
  if (typeof process !== 'undefined' && process.env.TZ) {
    return process.env.TZ;
  }
  // Default to EST if nothing else works
  return 'America/New_York';
}

// Determine the status of a time window
export function getTimeWindowStatus(
  currentTime: Date,
  startTime: string,
  endTime: string,
  timezone: string = 'America/New_York'
): 'active' | 'upcoming' | 'inactive' {
  // Get current time in target timezone
  const tzData = timezoneOptions.find(tz => tz.value === timezone);
  const tzOffset = tzData ? tzData.offset * 60 * 60 * 1000 : 0;
  
  const tzTime = new Date(currentTime.getTime() + tzOffset);
  const now = new Date(currentTime);
  
  // Get today's date in target timezone
  const today = new Date(Date.UTC(
    tzTime.getUTCFullYear(),
    tzTime.getUTCMonth(),
    tzTime.getUTCDate()
  ));
  
  // Parse the time strings (in target timezone)
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Create dates in target timezone
  const start = new Date(today);
  start.setHours(startHour, startMinute, 0, 0);
  
  const end = new Date(today);
  end.setHours(endHour, endMinute, 0, 0);
  
  // Handle overnight sessions
  const isOvernight = endHour < startHour;
  if (isOvernight) {
    end.setDate(end.getDate() + 1);
  }
  
  // Check if current time is within the window
  if (tzTime >= start && tzTime < end) {
    // console.log(`Active window: ${startTime}-${endTime} (${timezone})`, {
    //   now: tzTime.toISOString(),
    //   start: start.toISOString(),
    //   end: end.toISOString(),
    //   nowHours: tzTime.getHours(),
    //   startHours: start.getHours(),
    //   endHours: end.getHours(),
    //   isOvernight,
    //   timeUntilStart: start.getTime() - tzTime.getTime(),
    //   timeUntilEnd: end.getTime() - tzTime.getTime()
    // });
    return 'active';
  } else {
    // console.log(`Inactive window: ${startTime}-${endTime} (${timezone})`, {
    //   now: tzTime.toISOString(),
    //   start: start.toISOString(),
    //   end: end.toISOString(),
    //   nowHours: tzTime.getHours(),
    //   startHours: start.getHours(),
    //   endHours: end.getHours(),
    //   isOvernight,
    //   timeUntilStart: start.getTime() - tzTime.getTime(),
    //   timeUntilEnd: end.getTime() - tzTime.getTime(),
    //   comparison: {
    //     'now >= start': tzTime >= start,
    //     'now < end': tzTime < end
    //   }
    // });
  }
  
  // Calculate time until window starts/ends in target timezone
  const timeUntilStart = start.getTime() - tzTime.getTime();
  const timeUntilEnd = end.getTime() - tzTime.getTime();
  
  // If window is upcoming (starts within next 2 hours)
  const twoHoursInMs = 2 * 60 * 60 * 1000;
  if (timeUntilStart > 0 && timeUntilStart < twoHoursInMs) {
    return 'upcoming';
  }
  
  // If window should have started but hasn't yet (within 1 minute buffer)
  if (timeUntilStart <= 0 && timeUntilStart > -60000) {
    return 'upcoming';
  }
  
  // If window is in the future but more than 2 hours away
  if (timeUntilStart > 0) {
    return 'inactive';
  }
  
  // If window is in the past, check next occurrence
  if (tzTime >= end) {
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
    
    // Recalculate for next day's window
    const nextTimeUntilStart = start.getTime() - tzTime.getTime();
    if (nextTimeUntilStart > 0 && nextTimeUntilStart < twoHoursInMs) {
      return 'upcoming';
    }
  }
  
  return 'inactive';
}

// Format a duration in milliseconds to a readable string
export function formatDuration(ms: number): string {
  if (ms <= 0) return '00:00:00';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
}

// Find all active sessions based on current time
export function findActiveSession(currentTime: Date) {
  const activeSessions = sessionsData.filter(session => {
    const status = getTimeWindowStatus(currentTime, session.startTime, session.endTime);
    return status === 'active';
  });
  
  return activeSessions.length > 0 ? activeSessions[0] : null;
}

// Find all active killzones based on current time
export function findActiveKillzone(currentTime: Date) {
  const activeKillzones = killzonesData.filter(killzone => {
    const status = getTimeWindowStatus(currentTime, killzone.startTime, killzone.endTime);
    return status === 'active';
  });
  
  return activeKillzones.length > 0 ? activeKillzones[0] : null;
}

// Find all active macros based on current time
export function findActiveMacro(currentTime: Date) {
  const activeMacros = macrosData.filter(macro => {
    const status = getTimeWindowStatus(currentTime, macro.startTime, macro.endTime);
    return status === 'active';
  });
  
  return activeMacros.length > 0 ? activeMacros[0] : null;
}