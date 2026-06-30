"use client";

import { useState, useRef } from "react";
import { createComplaint } from "@/app/actions";

export type ComplaintData = {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: Date;
};

export default function ComplaintsClient({ initialComplaints }: { initialComplaints: ComplaintData[] }) {
  const [list, setList] = useState<ComplaintData[]>(initialComplaints);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mengubah file gambar ke Base64 dengan kompresi skala resolusi
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset status sukses & error sebelumnya saat memilih file baru
    setFormError(null);
    setFormSuccess(false);

    if (!file.type.startsWith("image/")) {
      setFormError("Berkas harus berupa gambar.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      setFormError("Ukuran gambar terlalu besar. Maksimal ukuran gambar yang diperbolehkan adalah 2 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreviewImage(null);
      setImageBase64("");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Lakukan kompresi di canvas ke resolusi max 800x600 px untuk membatasi ukuran penyimpanan DB
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Kompresi kualitas JPEG 60%
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
          setPreviewImage(compressedBase64);
          setImageBase64(compressedBase64.split(",")[1]);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    const formData = new FormData(e.currentTarget);
    if (imageBase64) {
      formData.set("image", imageBase64);
    }

    const result = await createComplaint(formData);

    if (result.ok) {
      setFormSuccess(true);
      setPreviewImage(null);
      setImageBase64("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      e.currentTarget.reset();

      // Refresh list lokal demi interaksi instan
      const newComplaint: ComplaintData = {
        id: Math.random().toString(),
        title: String(formData.get("title")),
        description: String(formData.get("description")),
        location: String(formData.get("location")),
        image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null,
        status: "pending",
        adminNotes: null,
        createdAt: new Date()
      };
      setList([newComplaint, ...list]);
    } else {
      setFormError(result.error || "Gagal mengirim pengaduan.");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Kolom Kiri: Form Pengaduan */}
      <div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-2xl shadow-emerald-900/5 md:p-10">
        <h2 className="font-display text-3xl font-black text-leaf-955">Laporkan Pengaduan Lingkungan</h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Temukan sungai kotor, tumpukan sampah liar, atau polusi lingkungan? Laporkan di sini beserta bukti foto agar admin dapat berkoordinasi dengan dinas kebersihan untuk menindaklanjutinya.
        </p>

        {formSuccess && (
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-100 text-sm font-semibold text-emerald-800">
            Laporan Anda telah berhasil terkirim! Admin akan meninjau lokasi dalam waktu dekat.
          </div>
        )}

        {formError && (
          <div className="mt-6 rounded-2xl bg-rose-50 p-4 border border-rose-100 text-sm font-semibold text-rose-800">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Judul Pengaduan</label>
            <input
              name="title"
              required
              placeholder="Contoh: Penumpukan Sampah Plastik Liar di Bantaran Sungai"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Lokasi Kejadian</label>
            <input
              name="location"
              required
              placeholder="Contoh: Jl. Diponegoro Gang 5, RT 02/RW 04, Samping Selokan"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Deskripsi Kejadian</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Tuliskan secara detail mengenai kondisi sampah atau pencemaran air, perkiraan volume sampah, dan dampak bagi masyarakat sekitar..."
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Foto Bukti Pengaduan</label>
            <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex w-full sm:w-auto items-center justify-center cursor-pointer gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-600 transition"
              >
                Pilih Foto Bukti
              </label>

              {previewImage && (
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setImageBase64("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white text-[10px] hover:bg-black"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Sistem akan mengompres gambar secara otomatis agar hemat kuota internet Anda.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-leaf-700 hover:bg-leaf-955 py-4 text-sm font-black text-white shadow-lg shadow-leaf-700/20 transition disabled:opacity-50"
          >
            {isSubmitting ? "Sedang Mengirim Laporan..." : "Kirim Laporan Pengaduan"}
          </button>
        </form>
      </div>

      {/* Kolom Kanan: Riwayat Pengaduan Saya */}
      <div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-2xl shadow-emerald-900/5 md:p-8">
        <h2 className="font-display text-2xl font-black text-leaf-955">Pelacakan Laporan Saya</h2>
        <p className="mt-1 text-sm text-slate-500">Status penanganan pengaduan yang pernah Anda ajukan.</p>

        <div className="mt-8 space-y-6">
          {list.map((c) => {
            const statusConfig = {
              pending: { label: "Pending", bg: "bg-amber-100 text-amber-800 border-amber-200", step: 1 },
              investigating: { label: "Ditinjau", bg: "bg-blue-100 text-blue-800 border-blue-200", step: 2 },
              resolved: { label: "Selesai", bg: "bg-emerald-100 text-emerald-800 border-emerald-200", step: 3 },
              rejected: { label: "Ditolak", bg: "bg-rose-100 text-rose-800 border-rose-200", step: 0 }
            }[c.status as "pending" | "investigating" | "resolved" | "rejected"] || { label: c.status, bg: "bg-slate-100 text-slate-800 border-slate-200", step: 0 };

            return (
              <div key={c.id} className="rounded-3xl border border-slate-100 p-5 hover:shadow-lg transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{c.title}</h3>
                    <div className="text-[11px] text-slate-400 font-semibold mt-1">
                      {new Date(c.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} · Lokasi: {c.location}
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusConfig.bg}`}>
                    {statusConfig.label}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">{c.description}</p>

                {c.image && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 max-h-40 bg-slate-50">
                    <img
                      src={c.image.startsWith("data:") ? c.image : `data:image/jpeg;base64,${c.image}`}
                      alt="Bukti Laporan"
                      className="w-full object-cover"
                    />
                  </div>
                )}

                {/* Progress Status Bar (Timeline) */}
                {statusConfig.step > 0 && (
                  <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4 text-[10px] font-bold text-slate-400">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white text-[9px] ${statusConfig.step >= 1 ? "bg-leaf-700" : "bg-slate-200"}`}>
                        ✓
                      </span>
                      <span className={statusConfig.step >= 1 ? "text-leaf-800" : ""}>Diterima</span>
                    </div>
                    <div className={`h-0.5 flex-1 mx-2 ${statusConfig.step >= 2 ? "bg-leaf-700" : "bg-slate-100"}`} />
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white text-[9px] ${statusConfig.step >= 2 ? "bg-leaf-700" : "bg-slate-200"}`}>
                        {statusConfig.step >= 2 ? "✓" : "2"}
                      </span>
                      <span className={statusConfig.step >= 2 ? "text-leaf-800" : ""}>Ditinjau</span>
                    </div>
                    <div className={`h-0.5 flex-1 mx-2 ${statusConfig.step >= 3 ? "bg-leaf-700" : "bg-slate-100"}`} />
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white text-[9px] ${statusConfig.step >= 3 ? "bg-leaf-700" : "bg-slate-200"}`}>
                        {statusConfig.step >= 3 ? "✓" : "3"}
                      </span>
                      <span className={statusConfig.step >= 3 ? "text-leaf-800" : ""}>Selesai</span>
                    </div>
                  </div>
                )}

                {/* Tanggapan/Catatan Resmi Admin */}
                {c.adminNotes && (
                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/40 p-3.5">
                    <div className="text-[10px] font-black text-leaf-955 uppercase tracking-widest">Tanggapan Admin:</div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed italic">"{c.adminNotes}"</p>
                  </div>
                )}
              </div>
            );
          })}

          {list.length === 0 && (
            <div className="py-8 text-center text-slate-400 font-medium text-sm">
              Belum ada pengaduan yang diajukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
