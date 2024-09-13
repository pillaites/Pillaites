import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";

const pillaitesSans = localFont({
  src: "./fonts/PillaitesSansVF.woff2",
  variable: "--font-pillaites-sans",
});

const pillaitesMono = localFont({
  src: "./fonts/PillaitesMonoVF.woff2",
  variable: "--font-pillaites-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Pillaites",
    default: "Pillaites",
  },
  description: "The social media platform for Pillaites College students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pillaitesSans.variable} ${pillaitesMono.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
