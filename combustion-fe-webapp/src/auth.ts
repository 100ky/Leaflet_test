import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    async jwt({ token, account }) {
      // On initial sign-in - store tokens from the account object
      if (account) {
        if (
          account.access_token &&
          account.id_token &&
          account.refresh_token &&
          account.expires_at
        ) {
          token.accessToken = account.access_token;
          token.idToken = account.id_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at;
        } else {
          throw new Error("❌ Missing token data from account object.");
        }
        return token;
      }

      // If there's no access token (user not signed in), skip refresh
      if (!token.accessToken) {
        return token;
      }

      // If token is still valid, return it
      const now = Math.floor(Date.now() / 1000);
      if (token.expiresAt && now < token.expiresAt) {
        return token;
      }

      // Token expired, try to refresh it
      return await refreshToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;

      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },
});

async function refreshToken(token: JWT) {
  try {
    const body = new URLSearchParams({
      client_id: process.env.AUTH_KEYCLOAK_ID as string,
      client_secret: process.env.AUTH_KEYCLOAK_SECRET as string,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    });

    const res = await fetch(process.env.REFRESH_TOKEN_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      console.warn(`⚠️  Refresh token request failed: ${res.status}`);
      return { ...token, error: "RefreshTokenFailed" };
    }

    const refreshedToken = await res.json();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      idToken: refreshedToken.id_token,
      refreshToken: refreshedToken.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + refreshedToken.expires_in,
    };
  } catch (err) {
    console.error("❌ Failed to refresh token: " + err);
    return { ...token, error: "RefreshTokenError" };
  }
}
