import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientLayout } from "@/components/layout/client-layout";
import { getSession } from "@/lib/session";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Library Management System",
  description: "Professional library management system with AI-powered recommendations",
};

async function LayoutWithSession({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const userRole = session?.user?.role ?? 'USER'
  return <ClientLayout userRole={userRole}>{children}</ClientLayout>
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LayoutWithSession>{children}</LayoutWithSession>
        </ThemeProvider>
      </body>
    </html>
  );
}
