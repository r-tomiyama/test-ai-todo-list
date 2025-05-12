import type { Metadata } from "next";
import { Geist, Geist_Mono, Kosugi_Maru } from "next/font/google";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kosugiMaru = Kosugi_Maru({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kosugi-maru",
});

export const metadata: Metadata = {
  title: "Todoリスト",
  description: "Todoリストアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={kosugiMaru.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
