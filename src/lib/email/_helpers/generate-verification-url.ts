export function generateVerificationUrl(token: string, complement: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return `${baseUrl}/${complement}?token=${token}`;
}
