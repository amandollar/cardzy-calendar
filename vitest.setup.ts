import '@testing-library/jest-dom/vitest';

import React from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

vi.mock('next/image', () => ({
  default: ({
    alt,
    src,
    fill,
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
    src: string | { src: string };
  }) =>
    React.createElement('img', {
      alt,
      src: typeof src === 'string' ? src : src.src,
      'data-fill': fill ? 'true' : undefined,
      'data-priority': priority ? 'true' : undefined,
      ...props,
    }),
}));
