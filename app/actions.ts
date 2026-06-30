"use server";

import { eq, sql, desc, count, and } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { disposals, redemptions, rewards, users, trashGuides, complaints } from "@/db/schema";
import { getPointsPerItem } from "@/lib/trash";
import { disposalSchema } from "@/lib/validations/disposal";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession, getSession } from "@/lib/session";
import { uploadFileToS3 } from "@/lib/upload";
import { SEED_GUIDES, SEED_REWARDS } from "@/lib/seed-data";

// ============================================================
// SEED DATA Awal (Rewards & Panduan Sampah)
// ============================================================

export async function seedRewards() {
  if (!db) return;
  const existing = await db.select({ id: rewards.id }).from(rewards).limit(1);
  if (existing.length > 0) return;
  await db.insert(rewards).values(
    SEED_REWARDS.map((r) => ({ ...r, validUntil: new Date("2027-12-31") }))
  );
}

export async function seedGuides() {
  if (!db) return;
  const existing = await db.select({ id: trashGuides.id }).from(trashGuides).limit(1);
  if (existing.length > 0) return;
  await db.insert(trashGuides).values(SEED_GUIDES);
}

// Helper untuk menjalankan inisialisasi seed awal jika kosong
export async function ensureInitialSeeds() {
  await seedRewards();
  await seedGuides();
}

// ============================================================
// AUTHENTICATION
// ============================================================

export async function register(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const province = String(formData.get("province") ?? "").trim();
  const regency = String(formData.get("regency") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const village = String(formData.get("village") ?? "").trim();
  const hamlet = String(formData.get("hamlet") ?? "").trim();

  if (!name || !email || password.length < 6 || !province || !regency || !district || !village || !hamlet) {
    redirect("/register?error=Data+tidak+lengkap.+Semua+kolom+wilayah+dan+password+min.+6+karakter+wajib+diisi.");
  }

  if (!db) {
    redirect("/register?error=Database+belum+tersambung.");
  }

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    redirect("/register?error=Email+sudah+terdaftar.");
  }

  const passwordHash = hashPassword(password);
  const [user] = await db.insert(users).values({
    name,
    email,
    passwordHash,
    province,
    regency,
    district,
    village,
    hamlet
  }).returning({
    id: users.id, name: users.name, email: users.email, role: users.role
  });

  await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role as "user" | "admin" });
  redirect("/");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // Jika admin mencoba login di pintu user biasa, tolak & arahkan ke portal admin
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=Harap+masuk+melalui+portal+khusus+admin.");
  }

  if (!db) {
    redirect("/login?error=Database+belum+tersambung.");
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    redirect("/login?error=Email+atau+password+salah.");
  }

  if (user.role === "admin") {
    redirect("/admin/login?error=Harap+masuk+melalui+portal+khusus+admin.");
  }

  if (user.isBlocked) {
    redirect("/login?error=Akun+Anda+telah+diblokir+karena+indikasi+kecurangan.");
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: "user"
  });

  redirect("/");
}

export async function adminLogin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // 1. Periksa bypass admin via env
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    await createSession({ userId: "env-admin", email, name: "Admin", role: "admin" });
    redirect("/admin");
  }

  if (!db) {
    redirect("/admin/login?error=Database+belum+tersambung.");
  }

  // 2. Periksa di database
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    redirect("/admin/login?error=Email+atau+password+salah.");
  }

  // Tolak jika bukan admin
  if (user.role !== "admin") {
    redirect("/admin/login?error=Akses+ditolak.+Halaman+ini+hanya+untuk+Administrator.");
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: "admin"
  });

  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function loginAsDemoUser() {
  const session = await getSession();
  if (session?.role !== "admin") {
    redirect("/login?error=Akses+ditolak.+Hanya+admin+yang+dapat+mengakses+mode+simulasi.");
  }

  const demoEmail = "demo-tester@ecotech.id";
  let demoUser = null;
  
  if (db) {
    const [existing] = await db.select().from(users).where(eq(users.email, demoEmail)).limit(1);
    demoUser = existing;

    if (!demoUser) {
      const [inserted] = await db.insert(users).values({
        name: "Tester Admin",
        email: demoEmail,
        role: "user",
        points: 500,
        province: "DKI JAKARTA",
        regency: "KOTA JAKARTA SELATAN",
        district: "KEBAYORAN BARU",
        village: "MELAWAI",
        hamlet: "RT 01/RW 01"
      }).returning();
      demoUser = inserted;
    }
  }

  await destroySession();
  
  if (demoUser) {
    await createSession({
      userId: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: "user",
      isSimulated: true
    });
  } else {
    // Fallback jika DB belum tersambung
    await createSession({
      userId: "demo-tester-id",
      email: demoEmail,
      name: "Tester Admin (Mock)",
      role: "user",
      isSimulated: true
    });
  }

  redirect("/");
}

export async function backToAdmin() {
  const session = await getSession();
  if (!session || !session.isSimulated) {
    redirect("/login?error=Akses+ditolak.+Sesi+simulasi+tidak+ditemukan.");
  }

  await destroySession();
  
  await createSession({
    userId: "env-admin",
    email: process.env.ADMIN_EMAIL || "admin@ecotech.id",
    name: "Admin",
    role: "admin"
  });

  redirect("/admin");
}

export async function analyzeTrashImage(base64Image: string) {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "Anda harus masuk terlebih dahulu." };
  }

  const apiKeyRaw = process.env.AI_API_KEY || "";
  const apiKey = apiKeyRaw.replace(/^["']|["']$/g, "").trim();
  
  const apiBaseRaw = process.env.AI_API_BASE || "https://api.openai.com/v1";
  const apiBase = apiBaseRaw.replace(/^["']|["']$/g, "").trim();
  
  const modelNameRaw = process.env.AI_MODEL || "gpt-4o-mini";
  const modelName = modelNameRaw.replace(/^["']|["']$/g, "").trim();

  if (!apiKey || apiKey === "isi_api_key_anda_di_sini" || apiKey === "") {
    return { ok: false, error: "API Key AI belum dikonfigurasi di server." };
  }

  if (!db) {
    return { ok: false, error: "Database belum tersambung." };
  }

  try {
    // Ambil daftar kategori aktif dari database agar pilihan kategori AI dinamis dan akurat
    const activeGuides = await db.select({ categoryKey: trashGuides.categoryKey }).from(trashGuides);
    const availableCategories = activeGuides.map((g) => g.categoryKey);

    if (availableCategories.length === 0) {
      return { ok: false, error: "Tidak ada kategori sampah aktif yang terdaftar di database." };
    }

    const promptText = `Periksa gambar terlampir secara teliti. Kategori aktif di database Eco Tech saat ini adalah: ${availableCategories.join(", ")}.

Kembalikan hasil dalam format JSON terstruktur persis seperti berikut:
{
  "isValidTrash": boolean, // true jika benar-benar sampah layak setor, false jika wajah, orang, hewan, atau barang utuh non-sampah
  "categoryKey": "salah satu dari kategori aktif di atas, atau kosongi jika isValidTrash adalah false",
  "detectedObjectName": "Nama objek spesifik yang dikenali (misal: Botol Plastik Aqua, Kardus Cokelat Bekas)",
  "confidence": 0.95,
  "reason": "Alasan klasifikasi kategori sampah, atau alasan penolakan jika isValidTrash bernilai false (dalam Bahasa Indonesia)"
}`;

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: "system",
            content: `PERAN & IDENTITAS:
Anda adalah "Eco Tech Vision Validator", sistem validator sensor kecerdasan buatan (AI) bersertifikat lingkungan hidup. Tugas utama Anda adalah secara jujur dan disiplin memverifikasi apakah objek utama pada foto benar-benar merupakan SAMPAH LAYAK SETOR untuk didaur ulang (seperti botol kosong, kertas bekas, kaleng penyok, dsb) atau BUKAN SAMPAH.

ATURAN FILTER ANTI-KECURANGAN (ANTI-CHEAT):
1. Anda WAJIB menyatakan gambar sebagai BUKAN SAMPAH ("isValidTrash": false, "categoryKey": "") jika foto tersebut didominasi oleh:
   - Wajah manusia, swafoto (selfie), potret orang, jari tangan, atau bagian tubuh manusia.
   - Hewan peliharaan atau hewan liar (kucing, anjing, burung, dsb).
   - Barang elektronik utuh/aktif layak pakai (keyboard komputer aktif, laptop, HP, mouse komputer, dsb).
   - Furnitur/perabotan utuh layak guna (kursi, meja, lemari, ranjang).
   - Bidang kosong (dinding kosong, lantai bersih tanpa sampah, langit, pemandangan bersih).
2. Tulis alasan penolakan secara jelas dan tegas dalam Bahasa Indonesia pada kolom "reason" (contoh: "Gambar ditolak karena terdeteksi berupa wajah manusia / benda utuh layak pakai").
3. Hanya klasifikasikan sebagai "isValidTrash": true jika terbukti berupa sampah nyata, sisa kemasan habis pakai, kertas robek/lecek, botol kosong bekas minuman, sisa makanan organik, kain bekas compang-camping, dsb.

FORMAT LUARAN:
Selalu kembalikan respon dalam format JSON objek terstruktur.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: promptText
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { ok: false, error: `API Error: ${response.status} ${response.statusText} (${errText})` };
    }

    const resData = await response.json();
    const contentText = resData.choices?.[0]?.message?.content;
    if (!contentText) {
      return { ok: false, error: "AI tidak mengembalikan konten analisis." };
    }

    const parsed = JSON.parse(contentText);
    return { ok: true, data: parsed };
  } catch (error: any) {
    return { ok: false, error: `Kesalahan saat memproses analisis AI: ${error.message || error}` };
  }
}

// ============================================================
// SETORAN SAMPAH USER (DISPOSALS)
// ============================================================

function isRealUser(userId: string | undefined): userId is string {
  return !!userId && userId !== "env-admin";
}

export async function createDisposalDirect(categoryKey: string, itemCount: number) {
  const parsed = disposalSchema.safeParse({ categoryKey, itemCount });
  if (!parsed.success) return { ok: false, error: "Data tidak valid" };

  const session = await getSession();
  if (!session || !isRealUser(session.userId)) {
    return { ok: false, error: "Anda harus masuk terlebih dahulu." };
  }

  if (!db) return { ok: false, error: "Database belum tersambung" };

  // Pastikan user tidak diblokir saat transaksi berjalan
  const [currentUser] = await db.select({ isBlocked: users.isBlocked }).from(users).where(eq(users.id, session.userId)).limit(1);
  if (currentUser?.isBlocked) {
    return { ok: false, error: "Akun Anda diblokir." };
  }

  // Hitung poin secara dinamis dari database (trash_guides)
  const [guide] = await db.select().from(trashGuides).where(eq(trashGuides.categoryKey, categoryKey)).limit(1);
  const basePoints = guide ? guide.basePoints : 5;
  const pointsPerItem = guide ? guide.pointsPerItem : 10;
  const pointsEarned = basePoints + (pointsPerItem * itemCount);

  // Simpan setoran dengan status awal "pending"
  await db.insert(disposals).values({
    userId: session.userId,
    categoryKey,
    itemCount,
    pointsEarned,
    status: "pending"
  });

  revalidatePath("/");
  revalidatePath("/profile");
  return { ok: true, pointsEarned };
}

// ============================================================
// PENUKARAN REWARD USER (REDEMPTIONS)
// ============================================================

export async function redeemReward(rewardId: string) {
  const session = await getSession();
  if (!session || !isRealUser(session.userId)) redirect("/login");

  if (!db) redirect("/rewards?error=Database+belum+tersambung.");

  // Validasi user aktif
  const [currentUser] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!currentUser) redirect("/login");
  if (currentUser.isBlocked) redirect("/login?error=Akun+Anda+diblokir.");

  // Query reward & validasi stok
  const [reward] = await db.select().from(rewards).where(eq(rewards.id, rewardId)).limit(1);
  if (!reward) redirect("/rewards?error=Reward+tidak+ditemukan.");
  if (reward.stock <= 0) redirect("/rewards?error=Stok+hadiah+habis.");

  // Validasi poin
  if (currentUser.points < reward.cost) {
    redirect(`/rewards?error=Poin+tidak+cukup.+Butuh+${reward.cost}%2C+kamu+punya+${currentUser.points}.`);
  }

  // Generate kode voucher unik (ECO-XXXXXX)
  const uniqueSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const voucherCode = `ECO-${uniqueSuffix}`;

  // Transaksi database: Kurangi poin user, kurangi stok reward, simpan redemption
  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({ points: sql`${users.points} - ${reward.cost}` })
      .where(eq(users.id, session.userId));

    await tx.update(rewards)
      .set({ stock: sql`${rewards.stock} - 1` })
      .where(eq(rewards.id, rewardId));

    await tx.insert(redemptions).values({
      userId: session.userId,
      rewardId: reward.id,
      pointsSpent: reward.cost,
      code: voucherCode,
      status: "pending"
    });
  });

  revalidatePath("/rewards");
  revalidatePath("/profile");
  revalidateTag("rewards");
  redirect("/profile");
}

// ============================================================
// ADMIN ACTIONS (VERIFIKASI SAMPAH & STATUS KLAIM)
// ============================================================

export async function approveDisposal(disposalId: string) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  if (!db) return;

  const [disposal] = await db.select().from(disposals).where(eq(disposals.id, disposalId)).limit(1);
  if (!disposal || disposal.status !== "pending") return;

  await db.transaction(async (tx) => {
    // Ubah status setoran menjadi approved
    await tx.update(disposals)
      .set({ status: "approved" })
      .where(eq(disposals.id, disposalId));

    // Jika setoran milik user terdaftar, tambahkan poinnya
    if (disposal.userId) {
      await tx.update(users)
        .set({ points: sql`${users.points} + ${disposal.pointsEarned}` })
        .where(eq(users.id, disposal.userId));
    }
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/profile");
  revalidateTag("guest-stats");
}

export async function rejectDisposal(disposalId: string) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  if (!db) return;

  await db.update(disposals)
    .set({ status: "rejected" })
    .where(eq(disposals.id, disposalId));

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/profile");
  revalidateTag("guest-stats");
}

export async function completeRedemption(redemptionId: string) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  if (!db) return;

  await db.update(redemptions)
    .set({ status: "completed" })
    .where(eq(redemptions.id, redemptionId));

  revalidatePath("/admin");
  revalidatePath("/profile");
}

// ============================================================
// ADMIN ACTIONS — PENGELOLAAN REWARDS CRUD
// ============================================================

export async function addReward(formData: FormData) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const provider = String(formData.get("provider") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const cost = Number(formData.get("cost"));
  const stock = Number(formData.get("stock") ?? 10);
  const category = String(formData.get("category") ?? "voucher");

  if (!title || !provider || !description || !cost) return;
  if (!db) return;

  await db.insert(rewards).values({ title, provider, description, cost, stock, category });
  revalidatePath("/admin");
  revalidatePath("/rewards");
  revalidateTag("rewards");
}

export async function updateReward(id: string, formData: FormData) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const provider = String(formData.get("provider") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const cost = Number(formData.get("cost"));
  const stock = Number(formData.get("stock"));
  const category = String(formData.get("category") ?? "voucher");

  if (!title || !provider || !description || !cost) return;
  if (!db) return;

  await db.update(rewards)
    .set({ title, provider, description, cost, stock, category, updatedAt: new Date() })
    .where(eq(rewards.id, id));

  revalidatePath("/admin");
  revalidatePath("/rewards");
  revalidateTag("rewards");
}

export async function deleteReward(id: string) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  if (!db) return;
  
  // Hapus log redemption yang merujuk ke reward ini demi integritas data referensi DB
  await db.delete(redemptions).where(eq(redemptions.rewardId, id));
  await db.delete(rewards).where(eq(rewards.id, id));
  revalidatePath("/admin");
  revalidatePath("/rewards");
  revalidateTag("rewards");
}

// ============================================================
// ADMIN ACTIONS — PENGELOLAAN PANDUAN & ATURAN POIN (TRASH GUIDES) CRUD
// ============================================================

export async function addGuide(formData: FormData) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");

  const categoryKey = String(formData.get("categoryKey") ?? "").trim().toLowerCase();
  const title = String(formData.get("title") ?? "").trim();
  const pointsPerItem = Number(formData.get("pointsPerItem") ?? 10);
  const basePoints = Number(formData.get("basePoints") ?? 5);
  const instruction = String(formData.get("instruction") ?? "").trim();

  if (!categoryKey || !title || !instruction) return;
  if (!db) return;

  await db.insert(trashGuides).values({ categoryKey, title, pointsPerItem, basePoints, instruction });
  revalidatePath("/admin");
  revalidatePath("/panduan");
  revalidatePath("/disposal");
  revalidateTag("trash-guides");
}

export async function updateGuide(id: string, formData: FormData) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const pointsPerItem = Number(formData.get("pointsPerItem"));
  const basePoints = Number(formData.get("basePoints"));
  const instruction = String(formData.get("instruction") ?? "").trim();

  if (!title || !instruction) return;
  if (!db) return;

  await db.update(trashGuides)
    .set({ title, pointsPerItem, basePoints, instruction, updatedAt: new Date() })
    .where(eq(trashGuides.id, id));

  revalidatePath("/admin");
  revalidatePath("/panduan");
  revalidatePath("/disposal");
  revalidateTag("trash-guides");
}

export async function deleteGuide(id: string) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  if (!db) return;

  await db.delete(trashGuides).where(eq(trashGuides.id, id));
  revalidatePath("/admin");
  revalidatePath("/panduan");
  revalidatePath("/disposal");
  revalidateTag("trash-guides");
}

// ============================================================
// ADMIN ACTIONS — USER MODERATION
// ============================================================

export async function updateUserPoints(userId: string, newPoints: number) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  if (!db) return;

  await db.update(users)
    .set({ points: newPoints, updatedAt: new Date() })
    .where(eq(users.id, userId));

  revalidatePath("/admin");
  revalidatePath("/profile");
}

export async function toggleUserBlock(userId: string) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  if (!db) return;

  const [user] = await db.select({ isBlocked: users.isBlocked }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return;

  await db.update(users)
    .set({ isBlocked: !user.isBlocked, updatedAt: new Date() })
    .where(eq(users.id, userId));

  revalidatePath("/admin");
}

// ============================================================
// PENGADUAN LINGKUNGAN ACTIONS (COMPLAINTS)
// ============================================================

export async function createComplaint(formData: FormData) {
  const session = await getSession();
  if (!session || !isRealUser(session.userId)) {
    return { ok: false, error: "Anda harus masuk terlebih dahulu." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const imageBase64 = String(formData.get("image") ?? "").trim(); // Base64 image dari client

  if (!title || !description || !location) {
    return { ok: false, error: "Semua kolom wajib diisi." };
  }

  if (!db) {
    return { ok: false, error: "Database belum tersambung." };
  }

  try {
    let imageUrl: string | null = null;

    if (imageBase64) {
      // Hitung ukuran gambar dari base64
      const sizeInBytes = (imageBase64.length * 3) / 4;
      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (sizeInBytes > maxSize) {
        return { ok: false, error: "Ukuran gambar melebihi batas 2 MB." };
      }

      // Hasilkan nama file acak yang unik di folder virtual complaints/
      const fileName = `complaints/complaint-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
      // Unggah ke Cloudflare R2 / S3 storage
      imageUrl = await uploadFileToS3(imageBase64, fileName);
    }

    await db.insert(complaints).values({
      userId: session.userId,
      title,
      description,
      location,
      image: imageUrl, // Simpan URL publik hasil upload R2 ke DB
      status: "pending"
    });

    revalidatePath("/pengaduan");
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: `Gagal mengirim pengaduan: ${error.message || error}` };
  }
}

export async function updateComplaintStatus(complaintId: string, status: string, adminNotes: string) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  if (!db) return;

  await db.update(complaints)
    .set({
      status,
      adminNotes: adminNotes.trim() || null,
      updatedAt: new Date()
    })
    .where(eq(complaints.id, complaintId));

  revalidatePath("/admin");
  revalidatePath("/pengaduan");
}

export async function deleteComplaint(complaintId: string) {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/login");
  if (!db) return;

  await db.delete(complaints).where(eq(complaints.id, complaintId));

  revalidatePath("/admin");
  revalidatePath("/pengaduan");
}

export async function getRegionalLeaderboard(level: "province" | "regency" | "district" | "village" | "hamlet") {
  if (!db) return [];

  let groupColumn;
  switch (level) {
    case "province": groupColumn = users.province; break;
    case "regency": groupColumn = users.regency; break;
    case "district": groupColumn = users.district; break;
    case "village": groupColumn = users.village; break;
    case "hamlet": groupColumn = users.hamlet; break;
    default: groupColumn = users.province;
  }

  const result = await db
    .select({
      regionName: groupColumn,
      totalPoints: sql<number>`sum(${disposals.pointsEarned})`,
      totalItems: sql<number>`sum(${disposals.itemCount})`,
      userCount: sql<number>`count(distinct ${users.id})`
    })
    .from(disposals)
    .innerJoin(users, eq(disposals.userId, users.id))
    .where(
      and(
        eq(disposals.status, "approved"),
        sql`${users.role} != 'admin'`,
        sql`${groupColumn} IS NOT NULL`,
        sql`${groupColumn} != ''`
      )
    )
    .groupBy(groupColumn)
    .orderBy(desc(sql`sum(${disposals.pointsEarned})`))
    .limit(10);

  return result.map((r) => ({
    regionName: r.regionName || "Tidak Diketahui",
    totalPoints: Number(r.totalPoints ?? 0),
    totalItems: Number(r.totalItems ?? 0),
    userCount: Number(r.userCount ?? 0)
  }));
}

