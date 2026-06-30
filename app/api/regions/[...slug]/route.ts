import { NextResponse } from "next/server";

const EMSIFA_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";
const KINDS = new Set(["provinces", "regencies", "districts", "villages"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const [kind, id] = slug;

  if (!KINDS.has(kind) || (kind !== "provinces" && !/^\d+$/.test(id ?? ""))) {
    return NextResponse.json({ error: "Request wilayah tidak valid." }, { status: 400 });
  }

  const path = kind === "provinces" ? "provinces.json" : `${kind}/${id}.json`;
  const response = await fetch(`${EMSIFA_BASE}/${path}`, {
    next: { revalidate: 60 * 60 * 24 * 30 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Gagal memuat wilayah." }, { status: 502 });
  }

  return NextResponse.json(await response.json(), {
    headers: {
      "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400",
    },
  });
}
