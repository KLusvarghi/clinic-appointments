// "use client";

// import {
//   GoogleOAuthProvider,
//   useGoogleLogin,
// } from "@react-oauth/google";

// import { authClient } from "@/lib/auth-client";

// function InnerGoogleButton() {

//   const login = useGoogleLogin({
//     flow: "auth-code", // ← mude aqui
//     onSuccess: async (codeResponse) => {
//       const res = await fetch("/api/auth/google-code-exchange", {
//         method: "POST",
//         body: JSON.stringify({ code: codeResponse.code }),
//       });
  
//       const { id_token, access_token } = await res.json();
  
//       await authClient.signIn.social({
//         provider: "google",
//         idToken: {
//           token: id_token,
//           accessToken: access_token,
//         },
//         callbackURL: "/dashboard",
//       });
//     },
//   });
 

//   return (
//     <button
//       onClick={() => login()}
//       className="w-full rounded bg-red-600 px-4 py-2 text-white"
//     >
//       Entrar com Google
//     </button>
//   );
// }

// export function GoogleSignInButton() {
//   return (
//     <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
//       <InnerGoogleButton />
//     </GoogleOAuthProvider>
//   );
// }
