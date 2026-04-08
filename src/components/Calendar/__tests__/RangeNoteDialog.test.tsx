import { fireEvent, render, screen } from '@testing-library/react';

import { RangeNoteDialog } from '../RangeNoteDialog';

describe('RangeNoteDialog', () => {
  it('closes on Escape and renders editable fields', () => {
    const onClose = vi.fn();

    render(
      <div>
        <button type="button">Outside trigger</button>
        <RangeNoteDialog
          isOpen
          selection={{ start: new Date(2026, 1, 4), end: new Date(2026, 1, 20) }}
          rangeNoteCharacterCount={12}
          rangeNoteTitleDraft="Trip plan"
          rangeNoteDraft="Trip details"
          onClose={onClose}
          onTitleChange={vi.fn()}
          onNoteChange={vi.fn()}
          onSave={vi.fn()}
        />
      </div>,
    );

    const dialog = screen.getByRole('dialog', { name: /feb 4 - feb 20/i });
    expect(screen.getByLabelText(/title/i)).toHaveValue('Trip plan');
    expect(screen.getByLabelText(/note/i)).toHaveValue('Trip details');
    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
