"use client";

import { useEffect, useState } from "react";

export function useAvatarUrl() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/avatar")
      .then((res) => res.ok ? res.json() : { url: null })
      .then((data) => setUrl(data.url ?? null))
      .catch(() => setUrl(null));
  }, []);

  return url;
}
