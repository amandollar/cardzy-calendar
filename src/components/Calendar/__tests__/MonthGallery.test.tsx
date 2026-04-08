import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MONTH_OPTIONS } from '../calendar.constants';
import { MonthGallery } from '../MonthGallery';

describe('MonthGallery', () => {
  it('renders all 12 month cards for the 2026 collection', () => {
    render(<MonthGallery onOpenMonth={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: /choose a month to open its planner/i }),
    ).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(MONTH_OPTIONS.length);

    MONTH_OPTIONS.forEach((month) => {
      expect(screen.getByRole('button', { name: new RegExp(month, 'i') })).toBeInTheDocument();
    });
  });

  it('opens the clicked month card', async () => {
    const user = userEvent.setup();
    const onOpenMonth = vi.fn();

    render(<MonthGallery onOpenMonth={onOpenMonth} />);

    await user.click(screen.getByRole('button', { name: /april/i }));

    expect(onOpenMonth).toHaveBeenCalledWith(3);
  });
});
