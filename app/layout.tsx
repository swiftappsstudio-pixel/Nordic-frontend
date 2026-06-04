import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ConditionalFooter } from "./_components/conditional-footer";
import { ConditionalNavBar } from "./_components/conditional-header";
import { SocialSidebar } from "./_components/social-sidebar";
import CookieConsent from "./_components/cookie-consent";
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<AuthProvider>
            <ConditionalNavBar />
            <SocialSidebar />
            {children}
            <ConditionalFooter />
            <CookieConsent />
          </AuthProvider>
      </body>
    </html>
  );
}
