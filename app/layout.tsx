import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Eternal Memories",
  description: "Preserving legacies forever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-[#F6F5F2]`}
      >
        {/* Wrapping everything at the absolute body root stops Next.js from destroying the audio element during page transitions */}
          <div className="grow">{children}</div>
      </body>
    </html>
  );
}
