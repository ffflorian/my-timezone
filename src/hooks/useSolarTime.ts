import {useEffect, useState} from 'react';

const MS_PER_SECOND = 1000;
const TICK_INTERVAL_MS = MS_PER_SECOND;
const MINUTES_PER_DEGREE = 4;
const SECONDS_PER_MINUTE = 60;

export function useSolarTime(longitude: null | number): Date | null {
  const [solarTime, setSolarTime] = useState<Date | null>(null);

  useEffect(() => {
    if (longitude === null) {
      setSolarTime(null);
      return;
    }

    setSolarTime(solarTimeFromLongitude(longitude));
    const intervalId = setInterval(() => {
      setSolarTime(solarTimeFromLongitude(longitude));
    }, TICK_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [longitude]);

  return solarTime;
}

function solarTimeFromLongitude(longitude: number): Date {
  const offsetMs = longitude * MINUTES_PER_DEGREE * SECONDS_PER_MINUTE * MS_PER_SECOND;
  return new Date(Date.now() + offsetMs);
}
