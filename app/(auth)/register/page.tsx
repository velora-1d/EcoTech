import Link from "next/link";
import { register } from "@/app/actions";
import RegisterForm from "./register-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center py-12 px-4 bg-slate-50/50">
      <div className="w-full max-w-md">
        <RegisterForm error={error} />
      </div>
    </main>
  );
}
