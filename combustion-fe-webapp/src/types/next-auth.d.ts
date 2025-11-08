import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
    } & DefaultSession["user"];
    expires: string;
    accessToken: string;
    idToken: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
  }
}
