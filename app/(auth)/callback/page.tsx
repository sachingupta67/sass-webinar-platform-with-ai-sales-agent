// TODO : Implement this page to handle the callback from the auth provider

import { onAuthenticateUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // Render fresh on every request because by default next js serves is static or cached

const AuthCallbackPage = async () => {
  console.log("hello");
  const auth = await onAuthenticateUser();
  console.log("auth::::", auth);
  if (auth.status === 200 || auth.status === 201) {
    redirect("/home");
  } else if (
    auth.status === 400 ||
    auth.status === 403 ||
    auth.status === 500
  ) {
    redirect("/");
  } else {
    redirect("/");
  }
};

export default AuthCallbackPage;
