"use client";

import { useEffect,useState } from "react";
import { toast } from "sonner";

export default function VerifyPendingPage() {
  const [canResend, setCanResend] = useState(false);
  const ONE_MINUTE = 1000 * 60;
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCanResend(true);
    }, ONE_MINUTE); // 1 minutos

    return () => clearTimeout(timeout);
  }, [ONE_MINUTE]);

  const handleResend = async () => {
    const res = await fetch("/api/email/resend-verification", { method: "POST" });
    if (res.ok) {
      toast.success("E-mail reenviado com sucesso.");
    } else {
      toast.error("Não foi possível reenviar o e-mail.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      <h1 className="text-2xl font-semibold">Verifique seu e-mail</h1>
      <p className="mt-4 text-gray-600">
        Enviamos um link para o seu e-mail. Verifique sua caixa de entrada ou spam.
      </p>

      <button
        onClick={handleResend}
        disabled={!canResend}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Reenviar e-mail de verificação
      </button>
    </div>
  );
}
