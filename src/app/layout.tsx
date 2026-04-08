import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cardzy Wall Calendar',
  description:
    'A responsive editorial wall calendar with date-range selection and integrated notes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
