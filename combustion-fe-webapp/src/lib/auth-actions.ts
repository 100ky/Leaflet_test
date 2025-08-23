"use server";

import { auth, signOut } from "@/auth";

export async function signOutCompletelyAction() {
  await signOutCompletely();
}

export async function signOutCompletely(redirect = true) {
  const session = await auth();

  if (!session) {
    console.log("ℹ️  User is already signed out.");
    return;
  }

  try {
    const endSessionUrl = new URL(process.env.END_SESSION_URL as string);
    endSessionUrl.searchParams.set("id_token_hint", session.idToken as string);

    const res = await fetch(endSessionUrl.toString(), { method: "GET" });

    if (!res.ok) {
      console.warn(`⚠️  Provider logout request failed: ${res.statusText}`);
      return;
    }
  } catch (err) {
    console.error(`❌ Failed to log out: ${(err as Error).message}`);
    return;
  }

  await signOut({ redirect: redirect });
}
