import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist } from "next/font/google";

import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "MetricsFlow AI - CPM para MEI",
  description: "Gestão de Desempenho Corporativo simplificada via WhatsApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={cn(jakarta.variable, "font-sans", geist.variable)}
    >
      <body className="bg-surface-main antialiased selection:bg-brand-500 selection:text-white">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
