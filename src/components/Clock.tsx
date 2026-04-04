import {format} from 'date-fns';
import {useSolarTime} from '../hooks/useSolarTime.ts';

export interface ClockProps {
  longitude: number;
}

export function Clock({longitude}: ClockProps) {
  const solarTime = useSolarTime(longitude);

  if (!solarTime) {
    return null;
  }

  return <p className="solar-time">{format(solarTime, 'HH:mm:ss')}</p>;
}
