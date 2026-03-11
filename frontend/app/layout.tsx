import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "La Petite Maison de l'Épouvante",
  description: "Fanzine Horreur & Fantastique",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={geist.className}>
        {children}
      </body>
    </html>
  );
}
