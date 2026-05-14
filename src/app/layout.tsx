import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AniLuna — Смотри аниме",
  description: "Аниме-платформа с тысячами тайтлов",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="bg-moon-950 text-moon-100">
      <body className="min-h-screen bg-gradient-to-b from-moon-950 via-moon-900 to-moon-950">
        {children}
      </body>
    </html>
  );
}
