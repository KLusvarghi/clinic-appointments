import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useDebounce } from "./use-debounce";

export function useAutoSaveSetting<T>(
  value: T,
  patch: (v: T) => Promise<void>,
  delay = 800,
) {
  const debounced = useDebounce(value, delay);
  const last = useRef<string>(JSON.stringify(value));
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");

  useEffect(() => {
    const serialized = JSON.stringify(debounced);
    if (serialized === last.current) return;
    last.current = serialized;
    setState("saving");
    patch(debounced)
      .then(() => setState("idle"))
      .catch(() => {
        setState("error");
        toast.error("Erro ao salvar");
      });
  }, [debounced, patch]);

  return state;
}
