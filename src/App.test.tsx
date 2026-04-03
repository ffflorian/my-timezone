import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, describe, expect, it, vi} from 'vitest';
import App from './App';

vi.mock('my-timezone', () => ({
  MyTimezone: function () {
    return {
      getDateByLongitude: vi.fn().mockResolvedValue(new Date('2024-01-01T12:34:56Z')),
      parseDate: vi.fn().mockReturnValue({
        day: '01',
        hours: '12',
        minutes: '34',
        month: '01',
        seconds: '56',
        year: '2024',
      }),
    };
  },
}));

describe('App', () => {
  afterEach(cleanup);
  it('renders heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', {name: /my-timezone/i})).toBeInTheDocument();
  });

  it('renders map placeholder', () => {
    render(<App />);
    expect(screen.getByLabelText('Map placeholder')).toBeInTheDocument();
  });

  it('renders coordinate inputs', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('e.g. 52.52')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 13.40')).toBeInTheDocument();
  });

  it('displays solar time after form submission', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('e.g. 13.40'), '13.40');
    await user.click(screen.getByRole('button', {name: /get solar time/i}));
    expect(await screen.findByText('12:34:56')).toBeInTheDocument();
  });

  it('displays error for invalid longitude', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', {name: /get solar time/i}));
    expect(await screen.findByText('Please enter a valid longitude.')).toBeInTheDocument();
  });
});
