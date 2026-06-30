import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { complaints } from "@/db/schema";
import { getSession } from "@/lib/session";
import ComplaintsClient from "./complaints-client";

export default async function ComplaintsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?error=Anda+harus+masuk+terlebih+dahulu+untuk+mengakses+menu+pengaduan.");
  }

  if (!db) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6 bg-slate-50">
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl max-w-sm">
          <h1 className="text-xl font-bold text-slate-800">Koneksi Error</h1>
          <p className="text-sm text-slate-500 mt-2">Database belum tersambung dengan benar.</p>
        </div>
      </div>
    );
  }

  // Mengambil daftar pengaduan spesifik milik user tersebut
  const userComplaints = await db
    .select()
    .from(complaints)
    .where(eq(complaints.userId, session.userId))
    .orderBy(desc(complaints.createdAt));

  // Konversi tipe tanggal agar aman untuk Client Component
  const formattedComplaints = userComplaints.map((c) => ({
    ...c,
    createdAt: new Date(c.createdAt)
  }));

  return (
    <main className="min-h-screen bg-slate-50/50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ComplaintsClient initialComplaints={formattedComplaints} />
      </div>
    </main>
  );
}
