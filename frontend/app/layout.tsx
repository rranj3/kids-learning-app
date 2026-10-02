import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Shreya's Learning World",
  description: 'A multi-age learning platform for children ages 2-12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
