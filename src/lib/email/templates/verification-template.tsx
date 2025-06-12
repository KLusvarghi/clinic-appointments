// interface verificationEmailTemplateProps {
//   userName: string;
//   verificationUrl: string;
// }

// export function verificationEmailTemplate({
//   userName,
//   verificationUrl,
// }: verificationEmailTemplateProps) {
//   return (
//     <div
//       style={{
//         fontFamily: "sans-serif",
//         maxWidth: "600px",
//         margin: "0 auto",
//         padding: "24px",
//         backgroundColor: "#ffffff",
//         color: "#111827",
//       }}
//     >
//       <h2
//         style={{
//           fontSize: "22px",
//           fontWeight: 700,
//           color: "#1F2937",
//         }}
//       >
//         Olá, {userName} 👋
//       </h2>

//       <p
//         style={{
//           fontSize: "16px",
//           margin: "16px 0",
//         }}
//       >
//         Estamos quase lá! Precisamos apenas que você confirme seu e-mail para
//         ativar sua conta.
//       </p>

//       <div
//         style={{
//           textAlign: "center",
//           margin: "32px 0",
//         }}
//       >
//         <a
//           href={verificationUrl}
//           style={{
//             backgroundColor: "#6366F1",
//             color: "#ffffff",
//             textDecoration: "none",
//             padding: "12px 24px",
//             borderRadius: "8px",
//             fontWeight: 600,
//             fontSize: "16px",
//             display: "inline-block",
//           }}
//         >
//           Verificar meu e-mail
//         </a>
//       </div>

//       <p
//         style={{
//           fontSize: "14px",
//           color: "#6B7280",
//         }}
//       >
//         Ou, se preferir, copie e cole este link no seu navegador:
//       </p>
//       <p
//         style={{
//           fontSize: "14px",
//           color: "#374151",
//           wordBreak: "break-all",
//         }}
//       >
//         {verificationUrl}
//       </p>

//       <hr
//         style={{
//           margin: "32px 0",
//           border: "none",
//           borderTop: "1px solid #E5E7EB",
//         }}
//       />

//       <p
//         style={{
//           fontSize: "13px",
//           color: "#9CA3AF",
//         }}
//       >
//         Você recebeu este e-mail porque criou uma conta no{" "}
//         <strong>Clinic Scheduling</strong>. Se não foi você, apenas ignore esta
//         mensagem.
//       </p>

//       <p
//         style={{
//           fontSize: "13px",
//           color: "#9CA3AF",
//         }}
//       >
//         — Equipe Clinic Scheduling
//       </p>
//     </div>
//   );
// }
