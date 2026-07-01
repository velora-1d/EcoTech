export default function Loading() {
  // ponytail: Loading state global sederhana dan hemat token untuk transisi menu instan
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 p-6">
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Spinner luar */}
        <div className="absolute h-full w-full rounded-full border-4 border-leaf-100 border-t-leaf-700 animate-spin" />
        {/* Daun di tengah */}
        <svg className="h-6 w-6 text-leaf-700 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="font-display text-lg font-black text-leaf-950">Memuat EcoTech...</h3>
        <p className="text-xs text-slate-500 mt-1">Mengambil data ramah lingkungan terbaru untuk Anda</p>
      </div>
    </div>
  );
}
