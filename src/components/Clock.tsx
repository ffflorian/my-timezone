import {useSolarTime} from '../hooks/useSolarTime.ts';

export interface ClockProps {
  longitude: number;
}

export function Clock({longitude}: ClockProps) {
  const solarTime = useSolarTime(longitude);

  if (!solarTime) {
    return null;
  }

  return <p className="solar-time">{solarTime.toISOString().slice(11, 19)}</p>;
}
