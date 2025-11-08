import { redirect } from "next/navigation";

import SignInButton from "@/components/auth/SignInButton";
import SignOutButton from "@/components/auth/SignOutButton";

import { auth } from "@/auth";

export default async function UserPanel() {
  const session = await auth();

  if (session?.error) {
    redirect("/api/force-sign-out");
  }

  return (
    <div className="flex items-center gap-4 text-gray-600">
      {!session ? (
        <SignInButton />
      ) : (
        <>
          <p className="text-sm font-medium">{session.user.name}</p>

          <SignOutButton />
        </>
      )}
    </div>
  );
}
