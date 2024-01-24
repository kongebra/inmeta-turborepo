import ThemeToggler from "@/components/theme-toggler";
import { interFontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Inmeta Games",
  description: "",
};

export const viewport: Viewport = {
  themeColor: [
    {
      color: "#ffffff",
      media: "(prefers-color-scheme: light)",
    },
    {
      color: "#020817",
      media: "(prefers-color-scheme: dark)",
    },
  ],
} satisfies Viewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          interFontSans.variable
        )}
      >
        <Providers>
          {children}
          <ThemeToggler />
        </Providers>
      </body>
    </html>
  );
}
