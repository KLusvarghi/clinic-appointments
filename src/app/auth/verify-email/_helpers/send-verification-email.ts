export async function sendVerificationEmail(email: string) {
  const res = await fetch("/api/auth/email/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to send email.");
  }

  return true;
}
