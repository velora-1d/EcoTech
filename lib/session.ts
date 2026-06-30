import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET ?? "ecotech-dev-secret-change-in-prod";

export type SessionData = {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin";
};

function sign(payload: SessionData): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verify(token: string): SessionData | null {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return null;
    const data = token.slice(0, dot);
    const sig = Buffer.from(token.slice(dot + 1), "base64url");
    const expected = Buffer.from(
      crypto.createHmac("sha256", SECRET).update(data).digest("base64url"),
      "base64url"
    );
    if (sig.length !== expected.length || !crypto.timingSafeEqual(sig, expected)) return null;
    return JSON.parse(Buffer.from(data, "base64url").toString()) as SessionData;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get("session")?.value;
  if (!token) return null;
  return verify(token);
}

export async function createSession(session: SessionData): Promise<void> {
  const store = await cookies();
  store.set("session", sign(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete("session");
}
