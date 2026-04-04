import {act, cleanup, renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {useSolarTime} from './useSolarTime';

const BERLIN_LONGITUDE = 13.4;
const ONE_HOUR_EAST_DEG = 15; // 15° east = +1 hour solar offset
const ONE_HOUR_WEST_DEG = -15; // 15° west = -1 hour solar offset
const ONE_SECOND_MS = 1000;

describe('useSolarTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('returns null when longitude is null', () => {
    const {result} = renderHook(() => useSolarTime(null));
    expect(result.current).toBeNull();
  });

  it('returns solar time for a given longitude', () => {
    const {result} = renderHook(() => useSolarTime(0));
    // longitude 0 means no offset from UTC
    expect(result.current).not.toBeNull();
    expect(result.current!.toISOString()).toBe('2024-01-01T12:00:00.000Z');
  });

  it('applies positive offset for east longitude', () => {
    // longitude 15° east = +1 hour offset
    const {result} = renderHook(() => useSolarTime(ONE_HOUR_EAST_DEG));
    expect(result.current!.toISOString()).toBe('2024-01-01T13:00:00.000Z');
  });

  it('applies negative offset for west longitude', () => {
    // longitude -15° west = -1 hour offset
    const {result} = renderHook(() => useSolarTime(ONE_HOUR_WEST_DEG));
    expect(result.current!.toISOString()).toBe('2024-01-01T11:00:00.000Z');
  });

  it('updates every second', () => {
    const {result} = renderHook(() => useSolarTime(0));
    expect(result.current!.toISOString()).toBe('2024-01-01T12:00:00.000Z');

    act(() => {
      vi.advanceTimersByTime(ONE_SECOND_MS);
    });
    expect(result.current!.toISOString()).toBe('2024-01-01T12:00:01.000Z');

    act(() => {
      vi.advanceTimersByTime(ONE_SECOND_MS);
    });
    expect(result.current!.toISOString()).toBe('2024-01-01T12:00:02.000Z');
  });

  it('resets to null when longitude changes to null', () => {
    const {rerender, result} = renderHook(({lon}: {lon: null | number}) => useSolarTime(lon), {
      initialProps: {lon: BERLIN_LONGITUDE as null | number},
    });
    expect(result.current).not.toBeNull();

    rerender({lon: null});
    expect(result.current).toBeNull();
  });

  it('clears interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const {unmount} = renderHook(() => useSolarTime(BERLIN_LONGITUDE));
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
