export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/user/avatar", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload failed");
  }

  return res.json() as Promise<{ id: string; url: string }>;
}
