import "./globals.css";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";

// Fonts are downloaded once at build time and served from the app itself.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-plex-mono", display: "swap" });

export const metadata = {
  title: "Bane Brother Tailor — Book a Visit",
  description: "Choose your cloth and book a fitting with Bane Brother Tailor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
