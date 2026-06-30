import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { logout } from "@/app/actions";
import Navbar from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eco Tech",
  description: "Aplikasi pengelolaan sampah dan reward berbasis poin."
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html lang="id">
      <body className="font-body antialiased">
        <Navbar session={session} onLogout={logout} />
        {children}
      </body>
    </html>
  );
}
