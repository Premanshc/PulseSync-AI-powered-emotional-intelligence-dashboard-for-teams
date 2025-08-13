import type { Metadata } from "next";
import "./globals.css";
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: "PulseSync - Team Emotional Intelligence Dashboard",
  description: "AI-powered emotional intelligence dashboard for remote and hybrid teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
