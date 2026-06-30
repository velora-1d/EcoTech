"use client";

import { useRef, useState } from "react";
import { createDisposalDirect, analyzeTrashImage } from "@/app/actions";
import { TrashIcon, LeafIcon } from "@/components/icons";
import { MAX_ITEMS_PER_DISPOSAL } from "@/lib/disposal-rules";

export type GuideData = {
  id: string;
  categoryKey: string;
  title: string;
  pointsPerItem: number;
  basePoints: number;
  instruction: string;
};

type ScanState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "unclear"; message?: string }
  | { status: "invalid"; reason: string }
  | { status: "detected"; categoryKey: string; detectedObjectName: string; confidence: number; reason: string }
  | { status: "done"; pointsEarned: number };

const QUICK_ITEM_COUNTS = [1, 2, 3, 5, 10];

export default function DisposalClient({ guides }: { guides: GuideData[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanState, setScanState] = useState<ScanState>({ status: "idle" });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState<number>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  function startCamera() {
    setCameraError(null);
    setSubmitError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Kamera tidak didukung di browser ini.");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .catch(() => navigator.mediaDevices.getUserMedia({ video: true }))
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => null);
          setIsCameraActive(true);
        }
      })
      .catch(() => setCameraError("Izin kamera ditolak. Aktifkan izin kamera di browser Anda."));
  }

  async function handleScan() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isCameraActive) {
      setCameraError("Nyalakan kamera terlebih dahulu.");
      return;
    }

    setScanState({ status: "scanning" });
    setSubmitError(null);

    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setScanState({ status: "idle" });
        return;
      }

      // Tangkap frame video saat ini ke canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Konversi gambar ke Base64 JPEG dengan kompresi kualitas medium (70%)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      const base64Image = dataUrl.split(",")[1];

      // Kirim data ke Server Action untuk dianalisis oleh AI
      const result = await analyzeTrashImage(base64Image);

      if (!result.ok || !result.data) {
        setScanState({ status: "unclear", message: result.error || "Gagal memproses gambar." });
        return;
      }

      const { categoryKey, detectedObjectName, confidence, isValidTrash, reason } = result.data;

      if (!isValidTrash) {
        setScanState({ status: "invalid", reason: reason || "Benda tidak teridentifikasi sebagai sampah layak daur ulang." });
        return;
      }

      // Validasi jika AI mengembalikan kategori di luar kategori aktif di database
      const isCategoryValid = guides.some((g) => g.categoryKey === categoryKey);
      if (!isCategoryValid) {
        setScanState({
          status: "unclear",
          message: `AI mengembalikan kategori '${categoryKey}' yang belum aktif di database.`
        });
        return;
      }

      setScanState({
        status: "detected",
        categoryKey,
        detectedObjectName: detectedObjectName || "Sampah Terpilah",
        confidence: Math.round(confidence * 100),
        reason: reason || ""
      });
      setItemCount(1); // reset kuantitas
    } catch (e: any) {
      setScanState({ status: "unclear", message: e.message || "Terjadi kesalahan koneksi saat memindai." });
    }
  }

  async function handleConfirm(categoryKey: string) {
    setSubmitError(null);
    if (itemCount < 1 || itemCount > MAX_ITEMS_PER_DISPOSAL) {
      setSubmitError(`Jumlah item maksimal ${MAX_ITEMS_PER_DISPOSAL} per pemindaian.`);
      return;
    }

    const result = await createDisposalDirect(categoryKey, itemCount);
    if (result?.ok) {
      setScanState({ status: "done", pointsEarned: result.pointsEarned ?? 0 });
    } else {
      setSubmitError(result?.error || "Gagal mencatat setoran sampah.");
    }
  }

  const activeGuide = scanState.status === "detected"
    ? guides.find((g) => g.categoryKey === scanState.categoryKey)
    : null;

  const estimatedPoints = activeGuide
    ? activeGuide.basePoints + activeGuide.pointsPerItem * itemCount
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Canvas Tersembunyi untuk Capture Image */}
      <canvas ref={canvasRef} className="hidden" width="640" height="480" />

      {/* Panel Kamera Pemindai */}
      <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-8">
        <h2 className="font-display text-2xl font-black text-leaf-950">Pemindai Kamera AI</h2>
        <p className="mt-1 text-sm text-slate-500">
          Arahkan kamera ke sampah, klik scan, dan AI akan menganalisis kelayakan serta kategori secara cerdas.
        </p>

        {/* Viewport Video */}
        <div className="relative mt-6 aspect-[3/4] sm:aspect-video overflow-hidden rounded-[1.5rem] bg-slate-900 shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          
          {/* Scanner Overlay Line */}
          {scanState.status === "idle" && isCameraActive && (
            <div className="absolute inset-x-8 top-1/2 h-0.5 bg-leaf-400 opacity-60 shadow-lg shadow-leaf-400 animate-pulse" />
          )}

          {scanState.status === "scanning" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center text-white">
                <div className="animate-spin h-8 w-8 border-4 border-leaf-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <div className="text-sm font-bold uppercase tracking-wider">AI sedang menganalisis foto...</div>
                <div className="text-xs text-slate-300 mt-1">Menghubungi OpenAI Compatible Engine</div>
              </div>
            </div>
          )}
        </div>

        {cameraError && (
          <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{cameraError}</p>
        )}

        {submitError && (
          <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">{submitError}</p>
        )}

        {/* Aksi Kamera */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={startCamera}
            className="flex-1 rounded-2xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            {isCameraActive ? "Aktifkan Kamera Ulang" : "Aktifkan Kamera"}
          </button>
          <button
            onClick={handleScan}
            disabled={!isCameraActive || scanState.status === "scanning"}
            className="flex-1 rounded-2xl bg-leaf-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-leaf-700/20 transition hover:bg-leaf-950 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
          >
            {scanState.status === "scanning" ? "Menganalisis..." : "Pindai Cerdas"}
          </button>
        </div>

        {/* Hasil Scan Objek Gagal Dikenali */}
        {scanState.status === "unclear" && (
          <div className="mt-6 rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
            <h3 className="font-bold text-amber-800">Pemindaian Gagal</h3>
            <p className="mt-1 text-sm leading-relaxed text-amber-700">
              {scanState.message || "AI tidak dapat mengenali objek. Dekatkan kamera atau pastikan cahaya cukup."}
            </p>
            <button
              onClick={() => setScanState({ status: "idle" })}
              className="mt-4 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Hasil Scan Objek Bukan Sampah (Invalid) */}
        {scanState.status === "invalid" && (
          <div className="mt-6 rounded-[1.5rem] bg-rose-50 p-5 ring-1 ring-rose-200">
            <div>
              <h3 className="font-bold text-rose-955">Sampah Tidak Layak Setor</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-rose-700">
                {scanState.reason}
              </p>
            </div>
            <button
              onClick={() => setScanState({ status: "idle" })}
              className="mt-4 w-full rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700 active:scale-95"
            >
              Scan Sampah Lain
            </button>
          </div>
        )}

        {/* Hasil Scan Objek Terdeteksi */}
        {scanState.status === "detected" && activeGuide && (
          <div className="mt-6 rounded-[1.5rem] bg-leaf-50 p-5 ring-1 ring-leaf-200/50 md:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                <TrashIcon size={24} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-leaf-600 uppercase tracking-widest">Kategori Terdeteksi</span>
                <h3 className="font-display text-2xl font-black text-leaf-950">{activeGuide.title}</h3>
                <div className="text-xs text-slate-500 mt-1 font-semibold">
                  Objek: <span className="text-slate-800 font-bold">{scanState.detectedObjectName}</span> (Akurasi: {scanState.confidence}%)
                </div>
                {scanState.reason && (
                  <p className="mt-2 rounded-xl bg-white/60 px-3 py-2 text-xs text-slate-500 leading-relaxed border border-leaf-200/20">
                    <strong>Alasan AI:</strong> {scanState.reason}
                  </p>
                )}
              </div>
            </div>

            {/* Form Kelola Kuantitas Sampah */}
            <div className="mt-6 border-t border-leaf-200/40 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Jumlah Item Disetor
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Maksimal {MAX_ITEMS_PER_DISPOSAL} item per pemindaian. Admin tetap memverifikasi jumlah fisik sebelum poin masuk.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_ITEM_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setItemCount(count)}
                    className={`rounded-xl px-4 py-2 text-xs font-black transition active:scale-95 ${
                      itemCount === count
                        ? "bg-leaf-700 text-white shadow-md shadow-leaf-700/10"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {count} item
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setItemCount(Math.max(1, itemCount - 1))}
                  disabled={itemCount <= 1}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-black text-slate-600 hover:bg-slate-50 active:scale-90"
                >
                  −
                </button>
                <div className="flex h-12 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white text-center text-lg font-black text-slate-800">
                  {itemCount}
                </div>
                <button
                  onClick={() => setItemCount(Math.min(MAX_ITEMS_PER_DISPOSAL, itemCount + 1))}
                  disabled={itemCount >= MAX_ITEMS_PER_DISPOSAL}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-black text-slate-600 hover:bg-slate-50 active:scale-90"
                >
                  +
                </button>
              </div>
            </div>

            {/* Detail Transparan Estimasi Poin */}
            <div className="mt-5 rounded-xl bg-white/70 p-4 border border-leaf-200/30">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rincian Estimasi Poin:</div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Poin Dasar Pemindaian:</span>
                <span className="font-semibold text-leaf-700">+{activeGuide.basePoints} pts</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-slate-600">
                <span>Poin per Item ({activeGuide.pointsPerItem} × {itemCount}):</span>
                <span className="font-semibold text-leaf-700">+{activeGuide.pointsPerItem * itemCount} pts</span>
              </div>
              <div className="mt-2 border-t border-slate-200/50 pt-2 flex items-center justify-between font-bold text-leaf-950">
                <span>Total Estimasi Poin:</span>
                <span className="text-base text-leaf-700">+{estimatedPoints} pts</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => handleConfirm(scanState.categoryKey)}
                className="flex-1 rounded-2xl bg-leaf-700 py-3.5 text-sm font-black text-white hover:bg-leaf-950 transition active:scale-95 shadow-md shadow-leaf-700/10"
              >
                Kirim Setoran (Pending)
              </button>
              <button
                onClick={() => setScanState({ status: "idle" })}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95"
              >
                Scan Ulang
              </button>
            </div>
          </div>
        )}

        {/* Setoran Selesai Terkirim */}
        {scanState.status === "done" && (
          <div className="mt-6 rounded-[1.5rem] bg-leaf-700 p-6 text-center text-white shadow-xl shadow-leaf-950/15">
            <h3 className="mt-3 text-2xl font-black">Setoran Berhasil Diajukan!</h3>
            <p className="mt-2 text-sm text-leaf-100 max-w-sm mx-auto leading-relaxed">
              Anda mendapatkan estimasi <strong className="text-white">+{scanState.pointsEarned} poin</strong>.
              Status setoran saat ini adalah <strong>Pending</strong>. Poin akan masuk ke saldo Anda setelah diverifikasi secara fisik oleh Admin.
            </p>
            <button
              onClick={() => setScanState({ status: "idle" })}
              className="mt-5 rounded-2xl bg-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/30 active:scale-95"
            >
              Scan Sampah Lain
            </button>
          </div>
        )}
      </div>

      {/* Panel Aturan Poin Terintegrasi */}
      <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-8">
        <h2 className="font-display text-2xl font-black text-leaf-950">Aturan Poin Aktif</h2>
        <p className="mt-1 text-sm text-slate-500">
          Berikut adalah tarif perolehan poin yang dikonfigurasi secara dinamis oleh Admin.
        </p>

        <div className="mt-6 space-y-4">
          {guides.map((g) => (
            <div key={g.id} className="rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-leaf-950">{g.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[200px] sm:max-w-xs">{g.instruction}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-leaf-700">+{g.pointsPerItem} pts/item</div>
                  <div className="text-xs text-slate-400 font-semibold">+{g.basePoints} pts base</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
