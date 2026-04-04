import {useEffect, useState} from 'react';

const MINUTES_PER_DEGREE = 4; // 4 minutes of solar time per degree of longitude
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;

const OFFSET_MS_PER_DEGREE = MINUTES_PER_DEGREE * SECONDS_PER_MINUTE * MS_PER_SECOND;
const TICK_INTERVAL_MS = MS_PER_SECOND;

export function useSolarTime(longitude: null | number): Date | null {
  const [solarTime, setSolarTime] = useState<Date | null>(null);

  useEffect(() => {
    if (longitude === null) {
      setSolarTime(null);
      return;
    }

    const tick = () => setSolarTime(new Date(Date.now() + longitude * OFFSET_MS_PER_DEGREE));

    tick();
    const interval = setInterval(tick, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [longitude]);

  return solarTime;
}
