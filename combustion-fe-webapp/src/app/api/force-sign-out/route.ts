/**
 * API route for forcefully signing out a user.
 *
 * This endpoint calls the signOutCompletely action and redirects the user
 * to the /signed-out page after sign-out is complete.
 */
import { NextResponse } from "next/server";

import { signOutCompletely } from "@/lib/auth-actions";

export async function GET() {
  await signOutCompletely(false);
  return NextResponse.redirect(`${process.env.ORIGIN_URL}/signed-out`);
}
