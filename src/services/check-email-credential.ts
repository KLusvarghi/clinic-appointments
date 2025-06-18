
/** Códigos de erro possíveis ao verificar um e-mail. */
export type EmailCheckErrorCode =
  | "not-found"
  | "wrong-provider"
  | "server-error";

export class EmailCheckError extends Error {
  constructor(
    public code: EmailCheckErrorCode,
    public provider?: string,
  ) {
    super(code);
  }
}