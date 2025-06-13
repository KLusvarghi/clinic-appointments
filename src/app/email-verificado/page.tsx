import Link from "next/link";

export default function EmailVerificadoPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">E-mail verificado com sucesso!</h1>
        <Link href="/auth/sign-in" className="text-blue-600 underline">
          Fazer login
        </Link>
      </div>
    </div>
  );
}
