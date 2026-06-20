import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SyncProvider } from "@/components/providers/SyncProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal DSA Tracker",
  description: "A beautiful, premium DSA tracker for interview preparation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <AuthProvider>
          <SyncProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </SyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
