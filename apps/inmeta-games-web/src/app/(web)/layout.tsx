import ThemeToggler from "@/components/theme-toggler";
import { interFontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Inmeta Games",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
