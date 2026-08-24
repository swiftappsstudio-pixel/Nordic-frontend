import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ConditionalFooter } from "./_components/conditional-footer";
import { ConditionalNavBar } from "./_components/conditional-header";
import { SocialSidebar } from "./_components/social-sidebar";
import CookieConsent from "./_components/cookie-consent";
import PromoAlert from "./_components/promo-alert";
import { AuthProvider } from "./_common/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nordic Home Healthcare",
  description: "Quality healthcare services delivered to your doorstep.",
  icons: {
    icon: "/images/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Pliant:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<AuthProvider>
            <ConditionalNavBar />
            <SocialSidebar />
            {children}
            <ConditionalFooter />
            <CookieConsent />
            <PromoAlert />
          </AuthProvider>
      </body>
    </html>
  );
}
