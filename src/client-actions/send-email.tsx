export async function sendEmailRequest(email: string, url: string) {
  console.log(url)
  const response = await fetch(`/api/email/${url}`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro ao enviar email");
  }

  return response.json(); // { success: true }
}
