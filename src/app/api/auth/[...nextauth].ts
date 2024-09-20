import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

// Extend the session user type to include `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }

  interface JWT {
    id: string;
  }
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
        session.user.id = token.id; // Attach user ID from token to session
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
