import {MyTimezone} from 'my-timezone';
import {useEffect, useState} from 'react';

const MS_PER_SECOND = 1000;
const TICK_INTERVAL_MS = MS_PER_SECOND;

export function useSolarTime(longitude: null | number): Date | null {
  const [solarTime, setSolarTime] = useState<Date | null>(null);

  useEffect(() => {
    if (longitude === null) {
      setSolarTime(null);
      return;
    }

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    new MyTimezone()
      .getDateByLongitude(longitude)
      .then(initialDate => {
        if (cancelled) {
          return;
        }
        const fetchedAt = Date.now();
        setSolarTime(initialDate);
        intervalId = setInterval(() => {
          setSolarTime(new Date(initialDate.getTime() + (Date.now() - fetchedAt)));
        }, TICK_INTERVAL_MS);
      })
      .catch(() => {
        // NTP fetch failure - leave solarTime as null
      });

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [longitude]);

  return solarTime;
}
