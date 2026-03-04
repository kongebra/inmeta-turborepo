import ThemeToggler from "@/components/theme-toggler";
import FakeLoadingBar from "@/components/shittify/FakeLoadingBar";
import CookieConsentHell from "@/components/shittify/CookieConsentHell";
import CursorTrail from "@/components/shittify/CursorTrail";
import PopupNotifications from "@/components/shittify/PopupNotifications";
import FakeAds from "@/components/shittify/FakeAds";
import AutoPlayAudio from "@/components/shittify/AutoPlayAudio";
import ArtificialDelay from "@/components/shittify/ArtificialDelay";
import DodgyElements from "@/components/shittify/DodgyElements";
import BadInputs from "@/components/shittify/BadInputs";
import MarqueeText from "@/components/shittify/MarqueeText";
import SnowEffect from "@/components/shittify/SnowEffect";
import VisualChaos from "@/components/shittify/VisualChaos";
import DarkPatternOverlay from "@/components/shittify/DarkPatternOverlay";
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
          <FakeLoadingBar />
          <MarqueeText />
          <BadInputs />
          <FakeAds />
          {children}
          <ThemeToggler />
          <CursorTrail />
          <SnowEffect />
          <PopupNotifications />
          <AutoPlayAudio />
          <ArtificialDelay />
          <DodgyElements />
          <VisualChaos />
          <DarkPatternOverlay />
          <CookieConsentHell />
        </Providers>
      </body>
    </html>
  );
}
