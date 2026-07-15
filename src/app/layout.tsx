import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fasa Certificados",
  description: "Painel interno para gestao segura de certificados digitais PFX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
