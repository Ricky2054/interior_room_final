import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  // Add this explicitly to use the environment variable
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  // Trust the NEXTAUTH_URL environment variable in production
  useSecureCookies: process.env.NODE_ENV === "production",
  // Debug mode to help diagnose issues
  debug: true,
  // Add custom pages for error handling
  pages: {
    error: '/auth-error', // Custom error page
    signIn: '/signin', // Custom sign-in page
  },
};