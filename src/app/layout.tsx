import type {Metadata} from 'next';
import './globals.css';
import { Toaster as HotToaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'ScanGo - Smart Checkout',
  description: 'A smart checkout system with AI-powered recommendations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <HotToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
