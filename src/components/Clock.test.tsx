import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {Clock} from './Clock';

const MOCK_DATE = new Date('2024-06-15T14:30:45.000Z');

vi.mock('../hooks/useSolarTime.ts', () => ({
  useSolarTime: vi.fn(),
}));

vi.mock('date-fns', () => ({
  format: vi.fn((_date: Date, _fmt: string) => '14:30:45'),
}));

describe('Clock', () => {
  afterEach(cleanup);

  it('renders the solar time in HH:mm:ss format', async () => {
    const {useSolarTime} = await import('../hooks/useSolarTime.ts');
    vi.mocked(useSolarTime).mockReturnValue(MOCK_DATE);
    render(<Clock longitude={13.4} />);
    expect(screen.getByText('14:30:45')).toBeInTheDocument();
  });

  it('applies solar-time class', async () => {
    const {useSolarTime} = await import('../hooks/useSolarTime.ts');
    vi.mocked(useSolarTime).mockReturnValue(MOCK_DATE);
    render(<Clock longitude={13.4} />);
    expect(screen.getByText('14:30:45')).toHaveClass('solar-time');
  });

  it('renders nothing when useSolarTime returns null', async () => {
    const {useSolarTime} = await import('../hooks/useSolarTime.ts');
    vi.mocked(useSolarTime).mockReturnValue(null);
    const {container} = render(<Clock longitude={13.4} />);
    expect(container.firstChild).toBeNull();
  });

  it('passes longitude to useSolarTime', async () => {
    const {useSolarTime} = await import('../hooks/useSolarTime.ts');
    vi.mocked(useSolarTime).mockReturnValue(MOCK_DATE);
    render(<Clock longitude={-74} />);
    expect(useSolarTime).toHaveBeenCalledWith(-74);
  });
});
