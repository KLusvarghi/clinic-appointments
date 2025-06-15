interface PasswordResetTemplateProps {
  userName: string;
  resetUrl: string;
}

const styles = {
  container: {
    fontFamily: "sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#ffffff",
    color: "#111827",
  },
  heading: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1F2937",
  },
  paragraph: {
    fontSize: "16px",
    margin: "16px 0",
  },
  buttonContainer: {
    textAlign: "center",
    margin: "32px 0",
  },
  button: {
    backgroundColor: "#6366F1",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "16px",
    display: "inline-block",
  },
  smallText: {
    fontSize: "14px",
    color: "#6B7280",
  },
  linkText: {
    fontSize: "14px",
    color: "#374151",
    wordBreak: "break-all",
  },
  divider: {
    margin: "32px 0",
    border: "none",
    borderTop: "1px solid #E5E7EB",
  },
  footer: {
    fontSize: "13px",
    color: "#9CA3AF",
  },
};

export function PasswordResetTemplate({
  userName,
  resetUrl,
}: PasswordResetTemplateProps) {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Olá, {userName} 👋</h2>

      <p style={styles.paragraph}>
        Estamos quase lá! Precisamos apenas que você confirme seu e-mail para
        ativar sua conta.
      </p>

      <div style={styles.buttonContainer}>
        <a href={resetUrl} style={styles.button}>
          Verificar meu e-mail
        </a>
      </div>

      <p style={styles.smallText}>
        Ou, se preferir, copie e cole este link no seu navegador:
      </p>
      <p style={styles.linkText}>{resetUrl}</p>

      <hr style={styles.divider} />

      <p style={styles.footer}>
        Você recebeu este e-mail porque criou uma conta no{" "}
        <strong>Clinic Scheduling</strong>. Se não foi você, apenas ignore esta
        mensagem.
      </p>
      <p style={styles.footer}>— Equipe Clinic Scheduling</p>
    </div>
  );
}
