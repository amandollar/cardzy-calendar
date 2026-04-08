import { createRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { RangeNoteDialog } from '../RangeNoteDialog';

describe('RangeNoteDialog', () => {
  it('closes on Escape and traps keyboard focus inside the dialog', async () => {
    const onClose = vi.fn();
    const textareaRef = createRef<HTMLTextAreaElement>();

    render(
      <div>
        <button type="button">Outside trigger</button>
        <RangeNoteDialog
          isOpen
          selection={{ start: new Date(2026, 1, 4), end: new Date(2026, 1, 20) }}
          rangeNoteCharacterCount={12}
          rangeNoteTitleDraft="Trip plan"
          rangeNoteDraft="Trip details"
          rangeNoteInputRef={textareaRef}
          onClose={onClose}
          onTitleChange={vi.fn()}
          onNoteChange={vi.fn()}
          onSave={vi.fn()}
        />
      </div>,
    );

    const dialog = screen.getByRole('dialog', { name: /feb 4 - feb 20/i });
    const closeButton = screen.getByRole('button', { name: /close/i });
    const saveButton = screen.getByRole('button', { name: /^save$/i });
    expect(dialog).toBeInTheDocument();

    await waitFor(() => expect(closeButton).toHaveFocus());

    closeButton.focus();
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(saveButton).toHaveFocus();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
