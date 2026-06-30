import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { logout } from "@/app/actions";
import Navbar from "@/components/navbar";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eco Tech",
  description: "Aplikasi pengelolaan sampah dan reward berbasis poin."
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const headerList = await headers();
  const pathname = headerList.get("x-current-path") || "";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="id">
      <body className="font-body antialiased">
        {!isAdminRoute && <Navbar session={session} onLogout={logout} />}
        {children}
      </body>
    </html>
  );
}
