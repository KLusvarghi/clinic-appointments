import { verifyEmail } from "@/actions/get-verify-email";
import { EmailCheckError } from "@/services/check-email-credential";

export const checkEmailCredential = async (email: string): Promise<void> => {
  const res = await verifyEmail({ email });

  if (res?.serverError) throw new EmailCheckError("server-error");

  const provider = res?.data?.provider;
  if (!provider) throw new EmailCheckError("not-found");

  if (provider !== "credential") {
    throw new EmailCheckError("wrong-provider", provider);
  }
  // se não lançou, está tudo ok (retorna void)
};