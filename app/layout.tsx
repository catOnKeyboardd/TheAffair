import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const serif = DM_Serif_Display({ variable: "--font-serif", subsets: ["latin"], weight: "400" });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TheAffair",
  description: "The dating app designed to be deleted. By Jensen.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        <StoreProvider>
          {/* Phone frame: full screen on mobile, centered "phone" on laptop/projector */}
          <div className="phone">
            <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
            <BottomNav />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
