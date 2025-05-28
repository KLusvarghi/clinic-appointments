import { createAuthClient } from "better-auth/react";
export const authClient =
  createAuthClient();
  // como nossa api é integrada co o next, não tem essa necessidade de passar o baseURL
  //   {
  //     baseURL: "http://localhost:3000"
  // }
