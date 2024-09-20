import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

// Extend DefaultSession to include user ID
interface User extends DefaultSession["user"] {
  id: string;
}

// Extend the JWT token to include user ID
interface Token {
  id: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Add other providers here if needed
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = (token as Token).id; // Attach user ID from token to session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Set user ID in token if user exists
      }
      return token;
    },
  },
};

// Export NextAuth configuration
export default NextAuth(authOptions);
