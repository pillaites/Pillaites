import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // example for Google provider
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add other providers here
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id; // Add user ID to session
      }
      return session;
    },
  },
});
