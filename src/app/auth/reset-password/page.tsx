"use client";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ONE_MINUTE = 60; // seconds

function useCountdownTimer(initialTime: number) {
  const [count, setCount] = useState(initialTime);
  const [canResend, setCanResend] = useState(false);

  // Initialize timer from localStorage if exists
  useEffect(() => {
    const storedTime = localStorage.getItem("resendTimerStart");
    if (storedTime) {
      const startTime = parseInt(storedTime);
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = Math.max(0, initialTime - elapsedTime);

      setCount(remainingTime);
      setCanResend(remainingTime === 0);
    }
  }, [initialTime]);

  // Start or update timer
  useEffect(() => {
    if (count === 0) {
      setCanResend(true);
      localStorage.removeItem("resendTimerStart");
      return;
    }

    // Store start time in localStorage
    if (!localStorage.getItem("resendTimerStart")) {
      localStorage.setItem("resendTimerStart", Date.now().toString());
    }

    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setCanResend(true);
          localStorage.removeItem("resendTimerStart");
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [count]);

  const resetTimer = () => {
    setCount(initialTime);
    setCanResend(false);
    localStorage.setItem("resendTimerStart", Date.now().toString());
  };

  return {
    count,
    canResend,
    resetTimer,
  };
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { count, canResend, resetTimer } = useCountdownTimer(ONE_MINUTE);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleResend = async () => {
    const res = await fetch("/api/email/resend-verification", {
      method: "POST",
    });
    if (res.ok) {
      toast.success("E-mail reenviado com sucesso.");
      resetTimer();
    } else {
      toast.error("Não foi possível reenviar o e-mail.");
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md text-center">
      <h1 className="text-2xl font-semibold">Verifique seu e-mail</h1>
      <p className="felx mt-4 flex-col justify-center text-gray-600">
        Enviamos um link para o seu e-mail{" "}
        <span className="bg-border flex justify-center rounded-md px-2 py-2 font-bold">
          {email}
        </span>
        . Verifique sua caixa de entrada ou spam.
      </p>

      <button
        onClick={handleResend}
        disabled={!canResend}
        // className="mt-6 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        className={classNames(
          "mt-6 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50",
          {
            ["cursor-not-allowed"]: !canResend,
          },
        )}
      >
        {canResend
          ? "Reenviar e-mail de verificação"
          : `Aguarde ${formatTime(count)}`}
      </button>
    </div>
  );
}
